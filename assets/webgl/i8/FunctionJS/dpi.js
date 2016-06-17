pc.script.create('dpi', function (app) {
    var Dpi = function (entity) {
        this.entity = entity;
    };

    Dpi.prototype = {
        initialize: function () {
            // detect: Android 5 or iOS 8
            var enableDPI = /(Android\s(5))|(OS\s8_)/.test(navigator.userAgent);
            
            if (enableDPI)
                app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
        }
    };

    return Dpi;
});