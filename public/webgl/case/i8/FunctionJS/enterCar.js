pc.script.create('enterCar', function (app) {
    var CLOSED = 0;
    var OPEN = 1;
    
    // Creates a new EnterCar instance
    var EnterCar = function (entity) {
        this.entity = entity;
        this.state = CLOSED;
        this.desiredState = CLOSED;
        this.qClosedL = new pc.Quat(0.16770329275499624, -0.13742740306195664, 0.7705436019984198, 0.5993762356868007);
        //this.qOpenL = new pc.Quat(0.00807662550707472, 0.21666899501620598, -0.9432854344908487, 0.25139988821894216);
        this.qOpenL = new pc.Quat(0.05971991238649869, -0.3044157265276763, 0.9163674128374995, -0.2530520921933029);
        this.percent = 1;
        this.qOpenPivot = new pc.Quat(0.08898384042448368, -0.7074410607015866, -0.09054051236260335, -0.6952779569336579);
        this.qStartPivot = new pc.Quat();
        this.camLpos = new pc.Vec3();
        this.camLrot = new pc.Quat();
        this.camFov = 0;
        this.fovOuside = 56;
        this.fovInside = 65;
        this.proj = new pc.Mat4();
        this.speed = 0.25;
        app._openDoor = this;
        
        this.fovFactor = 0;
    };

    var smoothstepC = function (c) {
        return c * c * (3 - 2 * c);
    }
    
    var aspectFactor = 0;
    
    pc.Mat4.prototype.setPerspective = function(fovy, aspect, znear, zfar) {
        var xmax, ymax, xmax2, ymax2;

        ymax = znear * Math.tan(fovy * Math.PI / 360);
        xmax = ymax * aspect;

        xmax2 = znear * Math.tan(fovy * Math.PI / 360);
        ymax2 = xmax2 / aspect;
        
        xmax = pc.math.lerp(xmax, xmax2, 1 - aspectFactor);
        ymax = pc.math.lerp(ymax, ymax2, 1 - aspectFactor);

        return this.setFrustum(-xmax, xmax, -ymax, ymax, znear, zfar);
    };
    
    EnterCar.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var self = this;
            this.door = app.root.findByName("left");
            this.inside = app.root.findByName("inside");
            
            app.graphicsDevice.on('resizecanvas', function(width, height) {
                self.updateFov(width / height);
            });
        },

        toggle: function () {
            if (this.state===this.desiredState) {
                this.percent = 0;
                this.desiredState = 1 - this.state;
                this.entity.fire('stateStart');
                
                if (this.desiredState===OPEN) {
                    app._carPivotRotation.enabled = false;
                    this.qStartPivot.copy(app._carPivotRotation.entity.getLocalRotation());
                    this.camLpos.copy(app.scene._activeCamera._node.getLocalPosition());
                    this.camLrot.copy(app.scene._activeCamera._node.getLocalRotation());
                    this.camFov = app.scene._activeCamera.getFov();
                    for(var i=0; i<app._leds.length; i++) app._leds[i].turnOn();
                } else {
                    //app._carPivotRotation.enabled = true;
                    var eul = app._carPivotRotation.entity.getEulerAngles();
                    app._carPivotRotation.yaw = app._carPivotRotation.yawTarget = eul.y-60;
                    for(var i=0; i<app._leds.length; i++) app._leds[i].turnOff();
                }
            }
        },
        
        updateFov: function(aspect) {
            var cam = app.scene._activeCamera;
            if (cam) {
                cam._fov = pc.math.lerp(this.fovOuside, this.fovInside, this.fovFactor);
                cam._projMatDirty = true;
                aspectFactor = Math.max(0, Math.min(1, aspect - 1)) * this.fovFactor;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            
            if (app.keyboard.wasPressed(pc.KEY_ENTER)) this.toggle();

            if (this.state!==this.desiredState) {
                var from = this.qClosedL;
                var to = this.qOpenL;

                this.percent = Math.min(this.percent + dt * this.speed, 1);
                if (this.percent===1) {
                    this.state = this.desiredState;
                    if (this.state==CLOSED) {
                        app._autoDistance.weight = 1;
                    }
                    this.entity.fire('state', this.state);
                }
                
                var doorPercent = Math.min(this.percent * 4, 1); // open
                var doorPercent2 = pc.math.clamp(this.percent * 4 - 2, 0,1); // close
                
                // Door rotation
                var rot = this.door.getLocalRotation();
                if (doorPercent < 1) {
                    rot.slerp(from, to, smoothstepC(doorPercent));
                } else {
                    rot.slerp(to, from, smoothstepC(doorPercent2));
                }
                this.door.setLocalRotation(rot);

                var movePercent, cam, pos, fov, zoomPercent;
                if (this.desiredState===OPEN) {
                    // Rotate camera's pivot to look at the door
                    rot = app._carPivotRotation.entity.getLocalRotation();
                    rot.slerp(this.qStartPivot, this.qOpenPivot, smoothstepC(doorPercent));
                    app._carPivotRotation.entity.setLocalRotation(rot);
                    
                    movePercent = Math.max(this.percent * 1.176 - 0.176, 0);
                    zoomPercent = smoothstepC(pc.math.clamp((movePercent - 0.1) / 0.1, 0,1));
                    movePercent = smoothstepC(movePercent);
                    
                    app._autoDistance.enabled = movePercent <= 0;
                    cam = app.scene._activeCamera._node;
                    
                    app.scene._activeCamera._projMatDirty = true;
                    
                    // Move inside
                    pos = cam.getPosition();
                    //var heightMod = this.percent;
                    //heightMod = smoothstepC(heightMod) * 0.4;
                    //console.log(this.percent);
                    var insidePos = this.inside.getPosition();
                    //insidePos.y -= heightMod;
                    pos.lerp(pos, insidePos, movePercent);
                    //insidePos.y += heightMod;
                    cam.setPosition(pos);

                    // Rotate inside
                    //rot = cam.getRotation();
                    //rot.slerp(rot, this.inside.getRotation(), movePercent);
                    //cam.setRotation(rot);
                    
                    // Fade mouselook in
                    app._mouseLook.enabled = movePercent > 0;
                    app._mouseLook.weight = movePercent;
                } else {
                    movePercent = Math.max(this.percent * 1.176 - 0.176, 0);
                    zoomPercent = smoothstepC(pc.math.clamp(movePercent / 0.1, 0,1));
                    movePercent = smoothstepC(movePercent);
                    cam = app.scene._activeCamera._node;
                    
                    pos = cam.getLocalPosition();
                    //pos.x = pc.math.lerp(pos.x, this.camLpos.x, movePercent);
                    //pos.y = pc.math.lerp(pos.y, this.camLpos.y, movePercent);
                     // z is dynamic and controller by autodistance script
                    //pos.lerp(pos, this.camLpos, movePercent);
                    if (movePercent < 0.3) {
                        pos.lerp(pos, this.camLpos, movePercent);
                        cam.setLocalPosition(pos);
                    }
                    
                    rot = cam.getLocalRotation();
                    rot.slerp(rot, this.camLrot, movePercent);
                    cam.setLocalRotation(rot);
                    
                    app.scene._activeCamera._projMatDirty = true;
                    
                    //app._mouseLook.weight = 1.0 - doorPercent;
                    app._carPivotRotation.enabled = movePercent > 0;
                    if (app._carPivotRotation.enabled && app._carPivotRotation.yawS !== 60) {
                        app._carPivotRotation.pitchS = -20;
                        app._carPivotRotation.yawS = 60;
                    }
                    app._autoDistance.enabled = movePercent > 0;
                    app._carPivotRotation.weight = movePercent;
                    app._autoDistance.weight = Math.max(movePercent - 0.3, 0) / 0.7;
                    
                    app._mouseLook.enabled = zoomPercent < 1;
                    app._mouseLook.weight = 1 - zoomPercent;
                }
            }
            
            if (app.scene._activeCamera) {
                var fovFactor = 0;
                if (this.desiredState === OPEN) {
                    fovFactor = Math.min(1, Math.max(0, (this.percent * 12) - 3.2));
                } else {
                    fovFactor = Math.min(1, Math.max(0, 2.7 - (this.percent * 12)));
                }
                if (Math.abs(this.fovFactor - fovFactor) > .005) {
                    this.fovFactor = this.fovFactor + (fovFactor - this.fovFactor) * .1;
                    if (Math.abs(this.fovFactor - fovFactor) < .005)
                        this.fovFactor = fovFactor;
                        
                    this.updateFov(app.scene._activeCamera._aspect);
                }
            }
        }
    };

    return EnterCar;
});