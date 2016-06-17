pc.script.attribute('defaultDist', 'number', 4);
pc.script.attribute('zDist', 'number', 3.3);
pc.script.attribute('xDist', 'number', 2.2);
pc.script.attribute('parentMovement', 'number', 1.5);
pc.script.attribute('speed', 'number', 1);
pc.script.attribute('distMult', 'number', 1);
pc.script.attribute('zoomMult', 'number', 1);

pc.script.create('autoDistance', function (app) {
    // Creates a new AutoDistance instance
    var AutoDistance = function (entity) {
        this.entity = entity;
        this.enabled = true;
        this.weight = 1;
        this.lpos2 = new pc.Vec3();
        //this.origPos = new pc.Vec3();
        app._autoDistance = this;
    };

    var smoothstep = function (a, b, c) {
        c = c * c * (3 - 2 * c);
        return pc.math.lerp(a, b, c);
    }

    AutoDistance.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            var cam = this.entity.camera.camera;
            cam.setHorizontalFov(true);
            cam.setFov(cam.getFov() / this.zoomMult);
            
            //this.origPos.copy(this.entity.getLocalPosition());
            
        },

        // Called every frame, dt is time in seconds since last update
        postUpdate: function (dt) {
            if (!this.enabled) return;

            var sp = dt * this.speed;
            var dir = this.entity.forward;
            var zAmount = Math.abs(dir.z);
            var xAmount = Math.abs(dir.x);
            var yAmount = Math.abs(dir.y);
            var dist = smoothstep(this.defaultDist, this.xDist, xAmount);
            dist = smoothstep(dist, this.zDist, zAmount) * this.distMult;
            
            var lpos = this.entity.getLocalPosition();
            lpos.z = smoothstep(lpos.z, dist, sp * this.weight);
            this.entity.setLocalPosition(lpos);
            
            this.lpos2.z = smoothstep(this.lpos2.z,  -dir.z * this.parentMovement,  sp * this.weight);
            this.lpos2.y = smoothstep(this.lpos2.y,  dir.y * (yAmount * 1.25 + 1) * (yAmount * -zAmount + 1),  sp * this.weight);
            this.entity.getParent().setLocalPosition(this.lpos2);
        }
    };

    return AutoDistance;
});