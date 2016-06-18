pc.script.attribute('asset', 'asset', [ ]);
pc.script.attribute('scale', 'number', 1);
pc.script.attribute('opacity', 'number', 1, {
    min: 0,
    max: 1
});

pc.script.create('blob', function (app) {
    var Blob = function (entity) {
        this.entity = entity;
    };

    Blob.prototype = {
        initialize: function () {
            var self = this;
            
            this.texture = null;
            if (! this.asset[0])
                return;
            
            this.textureAsset = app.assets.get(this.asset[0]);
            
            if (this.textureAsset.resource) {
                this.setTexture(this.textureAsset.resource);
            } else {
                this.textureAsset.once('load', function(asset) {
                    self.setTexture(asset.resource);
                    self.entity.fire('texture');
                });
                app.assets.load(this.textureAsset);
            }
            
            this.opacityOld = this.opacity;
            this.scaleOld = this.scale;
        },
        
        setTexture: function(resource) {
            this.texture = resource;
            this.entity.model.model.meshInstances[0].setParameter('texture_diffuseMap', this.texture);
            this.entity.model.model.meshInstances[0].setParameter('opacity', this.opacity);
            this.entity.model.model.meshInstances[0].setParameter('scale', this.scale);
        },
        
        update: function() {
            if (this.opacityOld !== this.opacity) {
                this.opacityOld = this.opacity;
                this.entity.model.model.meshInstances[0].setParameter('opacity', this.opacity);
            }
            
            if (this.scaleOld !== this.scale) {
                this.scaleOld = this.scale;
                this.entity.model.model.meshInstances[0].setParameter('scale', this.scale);
            }
        }
    };

    return Blob;
});