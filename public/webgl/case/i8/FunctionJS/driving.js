pc.script.attribute('diameter', 'number', 65);

pc.script.create('driving', function (app) {
    var Driving = function (entity) {
        this.entity = entity;
    };

    Driving.prototype = {
        initialize: function () {
            this.wheels = [ ];
            this.floor = app.root.findByName('ground').script.floor;
            var children = this.entity.getChildren();
            for(var i = 0; i < children.length; i++)
                this.wheels.push(children[i].findByName('body'));
        },

        update: function (dt) {
            if (! this.floor.speed)
                return;
            
            var p = (Math.PI * this.diameter / 100);
            var angle = (1 / p) * (this.floor.speed * 1000 / 60 / 60) * 360 * dt;
            for(var i = 0; i < this.wheels.length; i++)
                this.wheels[i].rotateLocal(angle, 0, 0);
        }
    };

    return Driving;
});