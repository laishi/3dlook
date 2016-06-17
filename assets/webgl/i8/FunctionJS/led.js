pc.script.create('led', function (app) {
    // Creates a new Led instance
    var Led = function (entity) {
        this.entity = entity;
        this.mat = null;
        this.targetIntensity = 0;
        this.percent = 1;
        this.timeToEnable = 0;
    };
    
    var smoothstepC = function (c) {
        return c * c * (3 - 2 * c);
    }
    
    var curve = function (x) {
      if (x < 0.1) {
          return smoothstepC(x / 0.1) * 2;
      } else {
          return pc.math.lerp(2, 1.0, smoothstepC(x - 0.1) / 0.9);
      }
    }

    Led.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            
            this.mat = this.entity.model.model.meshInstances[0].material.clone();
            this.entity.model.model.meshInstances[0].material = this.mat;
            this.mat.emissiveIntensity = 0;
            this.mat.update();
            
            if (!app._leds) app._leds = [];
            app._leds.push(this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (Date.now() < this.timeToEnable) return;
            
            if (this.percent < 1) {
                this.percent += dt * (this.targetIntensity===1? 0.5 : 10);
                if (this.percent > 1) this.percent = 1;
                
                this.mat.emissiveIntensity = this.targetIntensity===1? curve(this.percent) : (1-this.percent);
                this.mat.update();
            }
        },
        
        turnOn: function () {
            this.targetIntensity = 1;
            this.percent = 0;
            this.timeToEnable = Date.now() + 2000 + Math.random() * 500;
        },
        
        turnOff: function () {
            this.targetIntensity = 0;
            this.percent = 0;
            this.timeToEnable = 0;//Date.now() + 500;
        }
    };

    return Led;
});