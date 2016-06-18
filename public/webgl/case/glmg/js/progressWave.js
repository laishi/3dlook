(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function($, _) {
    var waveLoader,
        drawWave;

    $.fn.waveLoader = function() {
        var args = arguments;
        if (typeof args[0] === 'string') {
            $(this).each(function() {
                var ldr = $(this).data('waveLoader');
                ldr[args[0]].call(ldr, Array.prototype.slice.call(args, [1]));
            });
        } else {
            var options = _.extend({
                amp: 6,
                len: 10,
                color: 'rgba(255,255,255,0.8)'
            }, args[1] || {});
            $(this).each(function() {
                var $el = $(this);
                $el.data('waveLoader', waveLoader($el, args[0], options.color, options.amp, options.len));
            });
        }
    };

    drawWave = function(t) {
        var ctx = this.ctx;

        if (this.loop > 2) this.loop = 0;

        if (this.progress < 100) {
            window.requestAnimationFrame(drawWave.bind(this));
        }

        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);

        if (this.progress >= 100) {
            return;
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(0, this.height / 2);
        for (var i = 0; i <= this.width; i += 1) {
            ctx.lineTo(
                i,
                Math.sin(i / (this.len / 2) * Math.PI - this.loop * Math.PI) * (this.amp / 2) + (this.height - this.progress * (this.height / 100))
            );
        }
        ctx.lineTo(this.width, 0);
        ctx.lineTo(0, 0);
        ctx.fill();
        this.loop += 0.08;
    };

    waveLoader = function($progressWaveCanvas, img, color, amp, len) {
        var that;

        that = {
            $progressWaveCanvas: $progressWaveCanvas,
            img: img,
            ctx: null,
            width: 0,
            height: 0,
            loop: 0,
            amp: amp,
            len: len,
            color: color,
            progress: 0,
            init: function() {
                this.ctx = this.$progressWaveCanvas[0].getContext('2d');
                this.width = this.$progressWaveCanvas.width();
                this.height = this.$progressWaveCanvas.height();
                drawWave.call(this);
            },
            setProgress: function(newProgr) {
                this.progress = Math.min(Math.max(0, newProgr), 1000);
            }
        };

        that.init();

        return that;
    };
})(jQuery, _);





var img = new Image();

img.src = 'img/glmg.png';
img.onload = function() {
    $('#progressWaveCanvas').waveLoader(img, {
        amp: 20,
        len: 256,
        color: 'rgba(255,255,255,0.8)'
    });



    var progress = 50;
    var progressTime = 130000;

    // $('#progressWaveCanvas').waveLoader('setProgress', progress);


    // setInterval(function() {
    //     $('#progressWaveCanvas').waveLoader('setProgress', progress);
    //     progress += Math.floor(Math.random() * 2) + 1;
    // }, progressTime);






};
