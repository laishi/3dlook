var css = function() {/*
    #loading {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: auto;
        height: auto;
        opacity: 1;
        z-index: 1;
        background-color: #1d292c;
        transition: opacity 300ms;
    }

    #loading > canvas {
        position: absolute;
        top: calc(50% - 120px);
        left: calc(50% - 90px);
        display: block;
        background-image: url("https://s3-eu-west-1.amazonaws.com/static.playcanvas.com/car/bmw-logo.png");
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    
    #loading > .logo {
        position: absolute;
        top: calc(50% + 60px + 30px);
        left: calc(50% - 128px);
    }
    
    @media all and (max-height: 480px) {
        #loading > canvas {
            top: calc(50% - 100px);
            left: calc(50% - 60px);
            width: 120px;
            height: 120px;
        }
        #loading > .logo {
            top: calc(50% + 20px + 30px);
        }
    }
*/};
css = css.toString().trim();
css = css.slice(css.indexOf('/*') + 2).slice(0, -3);

var style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);

// splash
var loadingContainer = document.createElement('div');
loadingContainer.id = 'loading';
document.body.appendChild(loadingContainer);

var canvas = document.createElement('canvas');
canvas.width = 180;
canvas.height = 180;
loadingContainer.appendChild(canvas);
var ctx = canvas.getContext('2d');
ctx.strokeStyle = '#07f';
ctx.lineWidth = 9;

var logo = document.createElement('img');
logo.src = 'img/bmw-title.png';
logo.classList.add('logo');
loadingContainer.appendChild(logo);

var hideSplash = function () {
    loadingContainer.style.opacity = 0;
    
    setTimeout(function() {
        clearInterval(loadingUpdate);
        document.body.removeChild(loadingContainer);
    }, 300);
};

var loadingProgress = 0;
var loadingCurrent = 0;
var loadingUpdate = setInterval(function() {
    loadingCurrent += (loadingProgress - loadingCurrent) * 0.1;
    var degree = loadingCurrent * 2 * Math.PI;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 5, 0, degree, false);
    ctx.stroke();
}, 1000 / 60);

pc.script.createLoadingScreen(function (app) {
    app.on("preload:end", function () {
        app.off("preload:progress");
        loadingProgress = 1;
    });
    app.on("preload:progress", function(value) {
        loadingProgress = value;
    });
    app.assets.once('load:1973665', function(asset) {
        app.once('preRender', function() {
            setTimeout(hideSplash, 10);
        });
    });
});
