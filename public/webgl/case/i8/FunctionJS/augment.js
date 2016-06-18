pc.script.attribute('tag', 'string', '');
pc.script.attribute('func', 'string', '');
pc.script.attribute('offset', 'number', 0);

pc.script.create('augment', function (app) {
    var container = document.createElement('div');
    container.id = 'augmented';
    
    // insert after canvas
    var next = document.getElementById('application-canvas').nextSibling;
    if (next) {
        document.body.insertBefore(container, next);
    } else {
        document.body.appendChild(container);
    }
    
    var css = app.assets.get(2356385).resource;
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    
    var Augment = function (entity) {
        this.entity = entity;
    };

    Augment.prototype = {
        initialize: function () {
            var self = this;
            var augmented = app.root.findByName('augmented').script.augmented;
            augmented.add(this);
            
            this.state = false;
            this.point = new pc.Vec3();
            this.element = document.createElement('div');
            this.element.classList.add('item');
            container.appendChild(this.element);
            
            var inner = document.createElement('inner');
            inner.classList.add('inner');
            this.element.appendChild(inner);
            
            if (this.func) {
                var handler = function(evt) {
                    if (! self.entity.enabled || ! augmented.functions[self.func])
                        return;

                    augmented.functions[self.func]();
                    
                    evt.stopPropagation();
                };
                this.element.addEventListener('click', handler, false);
                this.element.addEventListener('touchstart', handler, false);
            }
            
            this.camera = app.root.findByName('camera-demo');
            this.hidden = 0;
        },
        
        onDisable: function() {
            if (! this.state)
                return;
            
            this.state = false;
            this.element.classList.remove('active');
            this.hidden = Date.now();
        },
        
        postUpdate: function() {
            this.point.copy(this.entity.getPosition()).sub(this.camera.getPosition()).normalize();
            var d = this.entity.up.dot(this.point) - this.offset;
            var c = this.camera.forward.dot(this.point);

            if ((d <= 0 || c <= .2) && this.state) {
                // hide
                this.state = false;
                this.element.classList.remove('active');
                this.hidden = Date.now();
                if (c <= .2)
                    this.element.style.display = 'none';
            } else if ((d > 0 && c > .2) && ! this.state) {
                // show
                this.state = true;
                this.element.style.display = '';
                this.element.classList.add('active');
            }

            if (this.state || (Date.now() - this.hidden) < 200) {
                this.camera.camera.worldToScreen(this.entity.getPosition(), this.point);
                this.element.style.transform = 'translate(' + this.point.x + 'px,' + this.point.y + 'px) rotate(45deg)';
                this.element.style.webkitTransform = 'translate(' + this.point.x + 'px,' + this.point.y + 'px) rotate(45deg)';
            }
        }
    };

    return Augment;
});