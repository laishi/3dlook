pc.script.attribute('materialAssets', 'asset', [ ], { type: 'material' });

pc.script.create('paint', function (app) {
    var Paint = function (entity) {
        this.entity = entity;
        this.percent = 0;
    }
    
    Paint.prototype = {
        initialize: function () {
            app._paint = this;
            this.materials = { };
            
            for(var i = 0; i < this.materialAssets.length; i++) {
                var asset = app.assets.get(this.materialAssets[i]);
                this.materials[asset.name] = asset.resource;
            }
            
            this.state = {
                exterior: {
                    name: 'elegant',
                    percent: 0
                },
                interior: {
                    name: 'elegant',
                    percent: 0
                }
            };

            this.params = {
                exterior: {
                    white: {
                        // body
                        'carpaint-body': {
                            diffuse: [ 170, 170, 170 ],
                            metalness: 0,
                            shininess: 90,
                            reflectivity: 1,
                        },
                        'carpaint-black-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        'carpaint-top-body': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: .5,
                            shininess: 100,
                            reflectivity: .1,
                        },
                        'plastic-blue-body': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        'glass-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        // wheel
                        'brakes-wheel': {
                            diffuse: [ 255, 255, 255 ],
                        },
                        'plastic-blue-wheel': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        // interior
                        'plastic-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        'cloth-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                    },
                    elegant: {
                        // body
                        'carpaint-body': {
                            diffuse: [ 96, 96, 96 ],
                            metalness: 1,
                            shininess: 30,
                            reflectivity: 1,
                        },
                        'carpaint-black-body': {
                            shininess: 50,
                            reflectivity: .5
                        },
                        'carpaint-top-body': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: .5,
                            shininess: 50,
                            reflectivity: .5,
                        },
                        'glass-body': {
                            shininess: 50,
                            reflectivity: .5
                        },
                        'plastic-blue-body': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        // wheel
                        'brakes-wheel': {
                            diffuse: [ 128, 128, 128 ],
                        },
                        'plastic-blue-wheel': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        // interior
                        'plastic-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        'cloth-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                    },
                    blue: {
                        // body
                        'carpaint-body': {
                            diffuse: [ 36, 89, 174 ],
                            metalness: 1,
                            shininess: 30,
                            reflectivity: 1,
                        },
                        'carpaint-black-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        'carpaint-top-body': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: .5,
                            shininess: 100,
                            reflectivity: .1,
                        },
                        'plastic-blue-body': {
                            diffuse: [ 48, 48, 48 ],
                        },
                        'glass-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        // wheel
                        'brakes-wheel': {
                            diffuse: [ 0, 91, 255 ],
                        },
                        'plastic-blue-wheel': {
                            diffuse: [ 0, 91, 255 ],
                        },
                        // interior
                        'plastic-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                        'cloth-blue-interior': {
                            diffuse: [ 0, 91, 220 ],
                        },
                    },
                    black: {
                        // body
                        'carpaint-body': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: .5,
                            shininess: 100,
                            reflectivity: .1,
                        },
                        'carpaint-black-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        'plastic-blue-body': {
                            diffuse: [ 255, 128, 0 ],
                        },
                        'carpaint-top-body': {
                            diffuse: [ 255, 128, 0 ],
                            metalness: .1,
                            shininess: 90,
                            reflectivity: .5,
                        },
                        'glass-body': {
                            shininess: 100,
                            reflectivity: .1
                        },
                        // wheel
                        'brakes-wheel': {
                            diffuse: [ 255, 128, 0 ],
                        },
                        'plastic-blue-wheel': {
                            diffuse: [ 255, 128, 0 ],
                        },
                        // interior
                        'plastic-blue-interior': {
                            diffuse: [ 255, 128, 0 ],
                        },
                        'cloth-blue-interior': {
                            diffuse: [ 255, 128, 0 ],
                        },
                    }
                },
                interior: {
                    white: {
                        // interior
                        'panel-top-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .2,
                            shininess: 30,
                            reflectivity: .7,
                        },
                        'leather-primary-interior': {
                            diffuse: [ 195, 173, 152 ],
                            metalness: .1,
                            shininess: 10,
                        },
                        'leather-second-interior': {
                            diffuse: [ 195, 173, 152 ],
                            metalness: .1,
                            shininess: 20,
                        },
                        'leather-third-interior': {
                            diffuse: [ 159, 134, 110 ],
                            metalness: 0,
                            shininess: 0,
                        },
                        'plastic-dark-interior': {
                            diffuse: [ 32, 32, 32 ],
                            metalness: 0,
                            shininess: 30,
                            reflectivity: .3,
                        },
                        'plastic-top-interior': {
                            diffuse: [ 211, 195, 180 ],
                            metalness: .1,
                            shininess: 85,
                            reflectivity: .3,
                        },
                        'plastic-shine-interior': {
                            diffuse: [ 64, 64, 64 ],
                            metalness: .5,
                            shininess: 80,
                        },
                        'metal-shine-interior': {
                            diffuse: [ 193, 193, 193 ],
                            metalness: .9,
                            shininess: 70,
                        },
                        'rubber-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: 0,
                            shininess: 0,
                        },
                        'labels-interior': {
                            emissive: [ 255, 255, 255 ]
                        },
                        // door
                        'leather-second-door': {
                            diffuse: [ 195, 173, 152 ],
                            metalness: .1,
                            shininess: 10,
                        },
                        // steering
                        'leather-brown-steering': {
                            diffuse: [ 32, 32, 32 ],
                            metalness: .4,
                            shininess: 40,
                        },
                        'labels-steering': {
                            emissive: [ 255, 255, 255 ]
                        },
                    },
                    elegant: {
                        // interior
                        'panel-top-interior': {
                            diffuse: [ 57, 41, 34 ],
                            metalness: .3,
                            shininess: 20,
                            reflectivity: .5,
                        },
                        'leather-primary-interior': {
                            diffuse: [ 57, 41, 34 ],
                            metalness: .3,
                            shininess: 20,
                        },
                        'leather-second-interior': {
                            diffuse: [ 195, 173, 152 ],
                            metalness: .1,
                            shininess: 20,
                        },
                        'leather-third-interior': {
                            diffuse: [ 83, 69, 64 ],
                            metalness: .3,
                            shininess: 10,
                        },
                        'plastic-dark-interior': {
                            diffuse: [ 50, 38, 32 ],
                            metalness: 0,
                            shininess: 8,
                            reflectivity: 1,
                        },
                        'plastic-top-interior': {
                            diffuse: [ 50, 38, 32 ],
                            metalness: 0,
                            shininess: 8,
                            reflectivity: 1,
                        },
                        'plastic-shine-interior': {
                            diffuse: [ 64, 64, 64 ],
                            metalness: 0,
                            shininess: 80,
                        },
                        'metal-shine-interior': {
                            diffuse: [ 193, 193, 193 ],
                            metalness: .9,
                            shininess: 70,
                        },
                        'rubber-interior': {
                            diffuse: [ 44, 44, 44 ],
                            metalness: 0,
                            shininess: 0,
                        },
                        'labels-interior': {
                            emissive: [ 255, 64, 0 ]
                        },
                        // door
                        'leather-second-door': {
                            diffuse: [ 195, 173, 152 ],
                            metalness: .1,
                            shininess: 20,
                        },
                        // steering
                        'leather-brown-steering': {
                            diffuse: [ 57, 41, 34 ],
                            metalness: .3,
                            shininess: 20,
                        },
                        'labels-steering': {
                            emissive: [ 255, 64, 0 ]
                        },
                    },
                    black: {
                        // interior
                        'panel-top-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .4,
                            shininess: 40,
                            reflectivity: .5,
                        },
                        'leather-primary-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .4,
                            shininess: 40,
                        },
                        'leather-second-interior': {
                            diffuse: [ 8, 8, 8 ],
                            metalness: .2,
                            shininess: 0,
                        },
                        'leather-third-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .4,
                            shininess: 40,
                        },
                        'plastic-dark-interior': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: 0,
                            shininess: 30,
                            reflectivity: .3,
                        },
                        'plastic-top-interior': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: 0,
                            shininess: 30,
                            reflectivity: .3,
                        },
                        'plastic-shine-interior': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .5,
                            shininess: 80,
                        },
                        'metal-shine-interior': {
                            diffuse: [ 96, 96, 96 ],
                            metalness: .9,
                            shininess: 70,
                        },
                        'rubber-interior': {
                            diffuse: [ 0, 0, 0 ],
                            metalness: 0,
                            shininess: 0,
                        },
                        'labels-interior': {
                            emissive: [ 0, 96, 255 ]
                        },
                        // door
                        'leather-second-door': {
                            diffuse: [ 8, 8, 8 ],
                            metalness: .2,
                            shininess: 0,
                        },
                        // steering
                        'leather-brown-steering': {
                            diffuse: [ 16, 16, 16 ],
                            metalness: .4,
                            shininess: 40,
                        },
                        'labels-steering': {
                            emissive: [ 0, 96, 255 ]
                        },
                    }
                }
            }
        },

        setState: function(type, state) {
            if (this.state[type] === state)
                return;
            
            this.state[type].name = state;
            this.state[type].percent = 0;
        },

        update: function (dt) {
            for(var s in this.state) {
                var state = this.state[s];
                if (state.percent >= 1)
                    continue;
                    
                state.percent = Math.min(1, state.percent + dt);

                for(var mat in this.params[s][state.name]) {
                    var matParams = this.params[s][state.name][mat];
                    for(var p in matParams) {
                        if (Array.isArray(matParams[p])) {
                            for(var i = 0; i < 3; i++) {
                                this.materials[mat][p].data[i] = pc.math.lerp(this.materials[mat][p].data[i], matParams[p][i] / 255, state.percent);
                            }
                        } else {
                            this.materials[mat][p] = pc.math.lerp(this.materials[mat][p], matParams[p], state.percent);
                        }
                    }
                    this.materials[mat].update();
                }
            }
        }
    };

    return Paint;
});