pc.script.attribute('weight', 'number', 1);
pc.script.attribute('sensivity', 'number', 0.5);
pc.script.attribute('easing', 'number', 0.2);
pc.script.attribute('maxPitchUp', 'number', 25);
pc.script.attribute('maxPitchDown', 'number', 25);

pc.script.create('mouseLook', function (app) {
    var MouseLook = function (entity) {
        this.entity = entity;
        this.enabled = false;
        this.oldQuat = new pc.Quat();
        this.steerAngle = 0;
        this.steerAngleSmooth = 0;
        app._mouseLook = this;
    };

    MouseLook.prototype = {
        postInitialize: function () {
            window.addEventListener('mousedown', this.onMouseDown.bind(this));
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mouseup', this.onMouseUp.bind(this));
            
            window.addEventListener('touchstart', this.onTouchStart.bind(this));
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
            window.addEventListener('touchend', this.onTouchEnd.bind(this));

            this.rotating = false;
            this.steerSelected = false;
            this.pitch = 0;
            this.yaw = 0;//-15;
            this.pitchTarget = 0;
            this.yawTarget = 0;//-15;
            this.m = { x: 0, y: 0 };
            this.ml = { x: 0, y: 0 };
            
            //this.entity.setEulerAngles(this.pitch, this.yaw, 0);
            
            this.steer = app.root.findByName("steerParent");
            this.wFL = app.root.findByName("front-left");
            this.wFR = app.root.findByName("front-right");
            this.steerRot = this.steer.getLocalRotation().clone();
            this.wheelRot = this.wFL.getLocalRotation().clone();
            
            this.touchInd = -1;
            this.turned = false;
        },
        
        intersectSphere: function(rayOrigin, rayDir, sphere) {
            rayOrigin.sub(sphere);
        	var b = rayOrigin.dot(rayDir);
        	var c = rayOrigin.dot(rayOrigin) - sphere.w * sphere.w;
        	var h = b * b - c;
        	return h >= 0.0;
        },
        
        checkSteer: function(evt) {
            var cam = app.scene._activeCamera;
            var pos = cam._node.getPosition().clone();
            var dir = cam.screenToWorld(evt.clientX * app.graphicsDevice.maxPixelRatio, evt.clientY * app.graphicsDevice.maxPixelRatio, 1, app.graphicsDevice.width, app.graphicsDevice.height).sub(pos).normalize();
            var sphere = new pc.Vec4(0.381, 0.776, 0.491, 0.415 * 0.5);
            this.steerSelected = this.intersectSphere(pos, dir, sphere);
        },
        
        onMouseDown: function(evt) {
            
            this.checkSteer(evt);
            this.rotating = true;
            this.m.x = evt.clientX;
            this.m.y = evt.clientY;
            this.ml.x = this.m.x;
            this.ml.y = this.m.y;
            evt.preventDefault();
            evt.stopPropagation();
        },
        
        onMouseMove: function(evt) {
            this.m.x = evt.clientX;
            this.m.y = evt.clientY;
        },
        
        onMouseUp: function() {
            this.rotating = false;
        },
        
        onTouchStart: function(evt) {
            this.rotating = true;
            
            if (this.touchInd !== -1 || ! evt.touches.length) return;
            var touch = evt.touches[0];
            this.touchInd = touch.identifier;
            
            this.checkSteer(touch);
            this.m.x = touch.clientX;
            this.m.y = touch.clientY;
            this.ml.x = this.m.x;
            this.ml.y = this.m.y;
            
            evt.preventDefault();
            evt.stopPropagation();
        },
        
        onTouchMove: function(evt) {
            for(var i = 0; i < evt.changedTouches.length; i++) {
                var touch = evt.changedTouches[i];
                if (touch.identifier === this.touchInd) {
                    this.m.x = touch.clientX;
                    this.m.y = touch.clientY;
                    return;
                }
            }
        },
        
        onTouchEnd: function(evt) {
            this.rotating = false;
            this.ratateEnd = Date.now();
            this.touchInd = -1;
        },
        
        
        update: function (dt) {
            if (!this.enabled) return;

            if (this.rotating) {
                var nx = this.ml.x - this.m.x;
                var ny = this.ml.y - this.m.y;
                
                if (this.steerSelected) {
                    this.steerAngle += nx * 0.3;
                    this.steerAngle = pc.math.clamp(this.steerAngle, -34, 34);
                    
                    if (! this.turned) {
                        this.turned = true;
                        var ground = app.root.findByName('ground');
                        ground.script.floor.speed = 0;
                        ground.model.model.meshInstances[0].material.setParameter('texture_diffuseMap', app.assets.get(2356114).resource);
                    }
                } else {
                    this.pitchTarget = Math.max(-this.maxPitchUp, Math.min(this.maxPitchDown, this.pitchTarget + ny * this.sensivity * this.weight));
                    this.yawTarget += nx * this.sensivity * this.weight;
                }

                this.ml.x = this.m.x;
                this.ml.y = this.m.y;
            }
            
            this.steerAngleSmooth = pc.math.lerp(this.steerAngleSmooth, this.steerAngle, dt * 10);
            var turn = new pc.Quat().setFromAxisAngle(pc.Vec3.FORWARD, this.steerAngleSmooth);
            var rot = this.steer.getLocalRotation();
            rot.mul2(this.steerRot, turn);
            this.steer.setLocalRotation(rot);
            
            turn = new pc.Quat().setFromAxisAngle(pc.Vec3.UP, this.steerAngleSmooth);
            rot = this.wFL.getLocalRotation();
            rot.mul2(this.wheelRot, turn);
            this.wFL.setLocalRotation(rot);
            this.wFR.setLocalRotation(rot);
            

            this.pitch += (this.pitchTarget - this.pitch) * this.easing;
            this.yaw += (this.yawTarget - this.yaw) * this.easing;
            
            this.oldQuat.copy(this.entity.getRotation());
            this.entity.setEulerAngles(this.pitch, this.yaw+180, 0); // const offset
            this.oldQuat.slerp(this.oldQuat, this.entity.getRotation(), this.weight);
            this.entity.setRotation(this.oldQuat);
        }
    };

   return MouseLook;
});