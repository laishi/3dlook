pc.script.attribute('sensivity', 'number', 0.5);
pc.script.attribute('easing', 'number', 0.2);
pc.script.attribute('maxPitchUp', 'number', 25);
pc.script.attribute('maxPitchDown', 'number', 25);

pc.script.create('rotation', function (context) {
    // Creates a new Rotation instance
    var Rotation = function (entity) {
        this.entity = entity;
        this.enabled = true;
        this.weight = 1;
        this.oldQuat = new pc.Quat();
        this.pitchS = -20;
        this.yawS = 10
        context._carPivotRotation = this;
    };

    Rotation.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            window.addEventListener('mousedown', this.onMouseDown.bind(this));
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mouseup', this.onMouseUp.bind(this));
            
            window.addEventListener('touchstart', this.onTouchStart.bind(this));
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
            window.addEventListener('touchend', this.onTouchEnd.bind(this));

            this.rotating = false;
            this.pitch = 0;
            this.yaw = -15;
            this.pitchTarget = 0;
            this.yawTarget = -15;
            this.m = { x: 0, y: 0 };
            this.ml = { x: 0, y: 0 };
            
            this.entity.setEulerAngles(this.pitch, this.yaw, 0);
            
            this.rotateEnd = 0;
            this.touchInd = -1;
        },
        
        onMouseDown: function(evt) {
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
            this.rotateEnd = Date.now();
        },
        
        onTouchStart: function(evt) {
            this.rotating = true;
            
            if (this.touchInd !== -1 || ! evt.touches.length) return;
            var touch = evt.touches[0];
            this.touchInd = touch.identifier;
            
            this.m.x = touch.clientX;
            this.m.y = touch.clientY;
            this.ml.x = this.m.x;
            this.ml.y = this.m.y;
            
            //if (touch.clientX < 154 && touch.clientY < 256) context._openDoor.toggle(); // wow such code
            
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
        

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (!this.enabled) return;
            
            if (this.rotating) {
                var nx = this.ml.x - this.m.x;
                var ny = this.ml.y - this.m.y;
                
                this.pitchTarget = Math.max(-this.maxPitchUp, Math.min(this.maxPitchDown, this.pitchTarget + ny * this.sensivity));
                this.yawTarget += nx * this.sensivity;

                this.ml.x = this.m.x;
                this.ml.y = this.m.y;
            } else if (Date.now() - this.rotateEnd > 1000) {
                this.yawTarget += 10 * dt * Math.min(1.0, ((Date.now() - this.rotateEnd) - 1000) / 2000);
            }
            
            if ((Math.abs(this.pitch - this.pitchTarget) + Math.abs(this.yaw - this.yawTarget)) > 0.1) {
                this.pitch += (this.pitchTarget - this.pitch) * this.easing;
                this.yaw += (this.yawTarget - this.yaw) * this.easing;
                
                this.oldQuat.copy(this.entity.getRotation());
                this.entity.setEulerAngles(this.pitch + this.pitchS, this.yaw + this.yawS, 0); // const offset
                this.oldQuat.slerp(this.oldQuat, this.entity.getRotation(), this.weight);
                this.entity.setRotation(this.oldQuat);
            }
        }
    };

    return Rotation;
});