var slowMo = false;
var dur = slowMo ? 5000 : 500;
function $(id){
  return document.getElementById(id);
}

var players = {};

var hue = 0;

function addTouch(e){
  var el = document.createElement('div');
  el.classList.add('ripple');
  var color = 'hsl('+(hue+=70)+',100%,50%)';
  el.style.background = color;
  var trans = 'translate('+e.pageX+'px,'+e.pageY+'px) '
  console.log(trans);
   var player = el.animate([
        {opacity: 0.5, transform: trans+"scale(0) "},
        {opacity: 1.0, transform: trans+"scale(2) "}
    ], {
        
        duration: dur
        
    });
  player.playbackRate = 0.1;
  players[e.identifier || 'mouse'] = player;
  
  document.body.appendChild(el);
  player.onfinish = function(){
    if(!document.querySelector('.ripple ~ .pad')) each(document.getElementsByClassName('pad'),function(e){
      e.remove();
    });
    el.classList.remove('ripple');
      el.classList.add('pad');
    
  }
}

function dropTouch(e){
  players[e.identifier || 'mouse'].playbackRate = 1;
}
function each(l,fn){
  for(var i = 0; i < l.length; i++){
    fn(l[i]);
  }
}
document.body.onmousedown = addTouch;
document.body.onmouseup = dropTouch;                          
                                
document.body.ontouchstart = function(e){
  e.preventDefault();
  each(e.changedTouches,addTouch);
};
document.body.ontouchend = function(e){
  e.preventDefault();
  each(e.changedTouches,dropTouch);
};

var el = document.body;

function prevent(e){
  e.preventDefault();
}

el.addEventListener("touchstart", prevent, false);
  el.addEventListener("touchend", prevent, false);
  el.addEventListener("touchcancel", prevent, false);
  el.addEventListener("touchleave", prevent, false);
  el.addEventListener("touchmove", prevent, false);




function fakeTouch(){
  var touch = {
    pageX:Math.random()*innerWidth,
    pageY:Math.random()*innerHeight,
    identifier:'fake_'+Math.random()+'__fake'
  }
  addTouch(touch);
  var length = Math.random()*1000+500;
  setTimeout(function(){
    dropTouch(touch);
  },length)
  setTimeout(function(){
    fakeTouch();
  },length - 100)
  
}
if(location.pathname.match(/fullcpgrid/i)) fakeTouch(); //demo in grid