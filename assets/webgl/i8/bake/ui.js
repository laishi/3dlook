pc.script.attribute('htmlSocial', 'asset', [ ], {
    max: 1,
    type: 'html'
});

pc.script.attribute('cssUi', 'asset', [ ], {
    max: 1,
    type: 'css'
});

pc.script.create('ui', function (app) {
    var Ui = function (entity) {
        this.entity = entity;
    };

    Ui.prototype = {
        initialize: function () {
            var cssAsset = app.assets.get(this.cssUi);
            var style = document.createElement('style');
            style.innerHTML = css;
            less.render(cssAsset.resource, function(err, output) {
                if (err) return console.error(err);
                style.innerHTML = output.css;
            });
            document.querySelector('head').appendChild(style);
            // live update css
            cssAsset.on('load', function() {
                less.render(cssAsset.resource, function(err, output) {
                    if (err) return console.error(err);
                    style.innerHTML = output.css;
                });
            });
            
            var social = document.createElement('div');
            social.innerHTML = app.assets.get(this.htmlSocial).resource;
            social = social.firstChild;
            document.body.appendChild(social);
            
            var share = function(network) {
                return function(evt) {
                    evt.stopPropagation();
                    
                    var left = (screen.width / 2) - (640 / 2);
                    var top = (screen.height / 2) - (380 / 2);
                    
                    var shareUrl = encodeURIComponent('http://car.playcanvas.com/');
                    var shareText = encodeURIComponent("Interactive BMW i8 right in your Browser! http://car.playcanvas.com/ Powered by @PlayCanvas #webgl #3d");
                    switch(network) {
                        case 'facebook':
                            shareUrl = "http://facebook.com/sharer.php?u=" + shareUrl + "&t=" + shareText;
                            break;
                        case 'twitter':
                            shareUrl = "https://twitter.com/intent/tweet?text=" + shareText;
                            break;
                    }

                    var popup = window.open(shareUrl, 'name', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 640 + ', height=' + 380 +', top=' + top + ', left=' + left);
                    if (window.focus && popup)
                        popup.focus();
                };
            };
            
            var socialButtons = social.querySelectorAll('.share');
            for(var i = 0; i < socialButtons.length; i++) {
                socialButtons[i].addEventListener('click', share(socialButtons[i].getAttribute('network')), false);
                socialButtons[i].addEventListener('touchstart', share(socialButtons[i].getAttribute('network')), false);
            }
            
            var fwa = document.createElement('a');
            fwa.href = 'http://www.thefwa.com/site/next-generation-car-configurator';
            fwa.target = '_blank';
            fwa.id = 'fwa';
            document.body.appendChild(fwa);
            fwa.addEventListener('touchstart', function(evt) {
                evt.stopPropagation();
            }, false);
            
            var powered = document.createElement('a');
            powered.href = 'http://playcanvas.com/';
            powered.target = '_blank';
            powered.id = 'powered';
            document.body.appendChild(powered);
            powered.addEventListener('touchstart', function(evt) {
                evt.stopPropagation();
            }, false);
            
            // button
            var button = document.createElement('div');
            button.id = 'button';
            document.body.appendChild(button);
            var changeState = function(evt) {
                app._openDoor.toggle();
                evt.stopPropagation();
            };
            button.addEventListener('touchstart', changeState, false);
            button.addEventListener('click', changeState, false);
            
            var presetsExterior = document.createElement('div');
            presetsExterior.classList.add('presets', 'exterior');
            document.body.appendChild(presetsExterior);
            
            var presetsInterior = document.createElement('div');
            presetsInterior.classList.add('presets', 'interior');
            document.body.appendChild(presetsInterior);
            
            var presetsContainers = {
                exterior: presetsExterior,
                interior: presetsInterior
            };
            
            var presetsList = {
                exterior: {
                    white: {
                        first: '#e6e6e6',
                        second: '#5593f7'
                    },
                    elegant: {
                        first: '#babdc6',
                        second: '#5593f7'
                    },
                    blue: {
                        first: '#5593f7',
                        second: '#585b5f'
                    },
                    black: {
                        first: '#1a1a1a',
                        second: '#eab055'
                    }
                },
                interior: {
                    white: {
                        first: '#e7dcd0',
                        second: '#414b58'
                    },
                    elegant: {
                        first: '#513b32',
                        second: '#d7c4b0'
                    },
                    black: {
                        first: '#414b58',
                        second: '#1c2631'
                    }
                }
            };
            
            var currentPreset = {
                exterior: null,
                interior: null
            };
            var setPreset = function(evt) {
                currentPreset[this.styleType].classList.remove('active');
                currentPreset[this.styleType] = this;
                currentPreset[this.styleType].classList.add('active');
                app._paint.setState(this.styleType, this.styleName);
                evt.stopPropagation();
            };

            for(var t in presetsList) {
                for(var p in presetsList[t]) {
                    // element
                    var preset = document.createElement('div');
                    preset.classList.add('preset');
                    preset.styleName = p;
                    preset.styleType = t;
                    if (p === 'elegant') {
                        currentPreset[t] = preset;
                        preset.classList.add('active');
                    }
                    presetsContainers[t].appendChild(preset);
                    
                    if (t === 'exterior') {
                        // first color
                        var first = document.createElement('div');
                        first.classList.add('first');
                        first.style.backgroundColor = presetsList[t][p].first;
                        first.style.borderColor = presetsList[t][p].first;
                        preset.appendChild(first);
                        // second color
                        var second = document.createElement('div');
                        second.classList.add('second');
                        second.style.backgroundColor = presetsList[t][p].second;
                        second.style.borderColor = presetsList[t][p].second;
                        preset.appendChild(second);
                    } else {
                        var color = document.createElement('div');
                        color.classList.add('color');
                        color.style.backgroundColor = presetsList[t][p].second;
                        color.style.borderColor = presetsList[t][p].first;
                        preset.appendChild(color);
                    }
                    
                    // event
                    preset.addEventListener('click', setPreset, false);
                    preset.addEventListener('touchstart', setPreset, false);
                }
            }
            
            // state change
            app._openDoor.entity.on('stateStart', function() {
                button.classList.add('transition');
            });
            app._openDoor.entity.on('state', function(state) {
                if (state === 1) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
                button.classList.remove('transition');
            });
        }
    };

    return Ui;
});