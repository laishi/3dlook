pc.script.create('exposure', function (app) {
    var Exposure = function (entity) {
        this.entity = entity;
    };

    Exposure.prototype = {
        initialize: function () {
            app.scene.exposure = 0;
            this.speed = .01;
        },

        update: function (dt) {
            if (app.scene.exposure < 16) {
                app.scene.exposure += dt * this.speed;
                this.speed += (4 - this.speed) * .02;
                if (app.scene.exposure >= 16) {
                    app.scene.exposure = 16;
                }
            }
        }
    };

    return Exposure;
});