pc.script.create('augmented', function (app) {
    var Augmented = function (entity) {
        this.entity = entity;
        this.items = [ ];
        this.index = { };
        
    };

    Augmented.prototype = {
        initialize: function () {
            var self = this;
            this.camera = app.root.findByName('camera-demo');
            
            this.functions = {
                'carEnter': function() {
                    app._openDoor.toggle();
                },
                'carExit': function() {
                    app._openDoor.toggle();
                }
            };
        },
        
        postInitialize: function() {
            var self = this;
            
            this.getByLabel('interior').forEach(function(item) {
                item.entity.enabled = false;
            });
            
            app.root.getChildren()[0].on('stateStart', function() {
                for(var i = 0; i < self.items.length; i++)
                    self.items[i].entity.enabled = false;
            });
            
            app.root.getChildren()[0].on('state', function(state) {
                var items = self.index[state ? 'interior': 'exterior'];
                for(var i = 0; i < items.length; i++)
                    items[i].entity.enabled = true;
            });
        },
        
        add: function(item) {
            this.items.push(item);
            
            if (item.tag) {
                var tags = item.tag.split(',');
                for(var i = 0; i < tags.length; i++) {
                    tags[i] = tags[i].trim();
                    
                    if (! tags[i])
                        continue;
                    
                    this.index[tags[i]] = this.index[tags[i]] || [ ];
                    this.index[tags[i]].push(item);
                }
            }
        },
        
        getByLabel: function(label) {
            return this.index[label] || [ ];
        }
    };

    return Augmented;
});