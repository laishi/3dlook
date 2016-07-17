(function(){
  var socket = io.connect(host);
  Reveal.initialize({
    history: true
  });

  /** start - only in master.js **/
  notifyServer = function(event){
    data = {
      indexv : Reveal.getIndices().v,
      indexh : Reveal.getIndices().h,
      indexf : Reveal.getIndices().f || 0
    }
    socket.emit("slidechanged" , data);
  }
  // listeners for slide change/ fragment change events
  Reveal.addEventListener("slidechanged", notifyServer);
  Reveal.addEventListener("fragmentshown", notifyServer);
  Reveal.addEventListener("fragmenthidden", notifyServer);
  /** end - only in master.js **/



/*
  $(document).click(function() {
    alert( "Handler for .click() called." );
  });*/


  document.addEventListener("click", gofun);

  function gofun(){

        //data = alert( "Handler for .click() called." );

        socket.emit('door');
    }


  // Move to corresponding slide/ frament on receiving 
  // slidechanged event from server
  socket.on('slidechanged', function (data) {
    Reveal.slide(data.indexh, data.indexv, data.indexf);
  });

  socket.on('click',function (data) {
    click.data;
  });






    
})();


