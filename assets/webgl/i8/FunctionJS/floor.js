pc.script.attribute('speed', 'number', 60);

pc.script.create('floor', function (app) {
    var Floor = function (entity) {
        this.entity = entity;
    };

    Floor.prototype = {
        initialize: function () {
            this.vec = new pc.Vec4(8, 8, .5, 0);
        },

        update: function (dt) {
            if (! this.speed)
                return;
            
            this.vec.w = this.vec.w - (this.speed * 1000 / 60 / 60) * dt;
            if (this.vec.w < 0) this.vec.w += 1.0;
            this.entity.model.model.meshInstances[0].setParameter('texture_diffuseMapTransform', this.vec.data);
        }
    };

    return Floor;
});