pc.script.attribute('to', 'string', "");

pc.script.create('parentAndSaveTransform', function (app) {
    // Creates a new ParentAndSaveTransform instance
    var ParentAndSaveTransform = function (entity) {
        this.entity = entity;
    };

    ParentAndSaveTransform.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {

            var parent = app.root.findByName(this.to);

            var wPos = this.entity.getPosition();
            var wRot = this.entity.getRotation();
            
            var current = this.entity.getParent();
            if (current) {
                current.removeChild(this.entity);
            }
            
            this.tmpMat4 = new pc.Mat4();
            this.tmpQuat = new pc.Quat();
            
            this.entity.setPosition(this.tmpMat4.copy(parent.getWorldTransform()).invert().transformPoint(wPos));
            this.entity.setRotation(this.tmpQuat.copy(parent.getRotation()).invert().mul(wRot));
            
            parent._children.push(this.entity);
            this.entity._parent = parent;

            this.entity.dirtyWorld = true;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return ParentAndSaveTransform;
});