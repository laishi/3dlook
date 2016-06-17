$(document).ready(function(){

	var menuItem=$(".colItem");
	var menuToggleBTN=$(".menu-toggle-button");
	var menuItemNum=menuItem.length;
	
	var angle=120;
	var distance=90;
	var startingAngle=180+(-angle/2);
	var slice=angle/(menuItemNum-1);

	var onCol = false;
	var onMap = false;
	var onRunCar = false;
	var onannotations = false;

	TweenMax.globalTimeScale(1.0);


	var changColorBtn = $(".changColorBtn");
	var changMapBtn = $(".changMapBtn");
	var runCarBtn = $(".runCarBtn");
	var lightingBtn = $(".lightingBtn");
	var annotationsBtn = $(".annotationsBtn");




	changColorBtn.on("mousedown",function () {

		menuItem=$(".colItem");
		menuToggleBTN=changColorBtn;
		menuItemNum=menuItem.length;

		angle=180;
		distance=90;
		startingAngle=180+(-angle/2);
		slice=angle/(menuItemNum-1);

		menuItemAngle();

		onCol=!onCol;

/*		TweenMax.to($(this).children('.menu-toggle-icon'),0.4,{
			rotation:onCol?45:0,
			ease:Quint.easeInOut,
			force3D:true
		});*/

		onCol?openMenu():closeMenu();
	});



	changMapBtn.on("mousedown",function () {

		menuItem=$(".mapItem");
		menuToggleBTN=changMapBtn;
		menuItemNum=menuItem.length;

		angle=120;
		distance=90;
		startingAngle=180+(-angle/2);
		slice=angle/(menuItemNum-1);

		menuItemAngle();

		onMap=!onMap;



		onMap?openMenu():closeMenu();
	});



	runCarBtn.on("mousedown",function () {

		menuItem=$(".runCarItem");
		menuToggleBTN=runCarBtn;
		menuItemNum=menuItem.length;

		angle=180;
		distance=90;
		startingAngle=180+(-angle/2);
		slice=angle/(menuItemNum-1);

		menuItemAngle();
			
		onRunCar=!onRunCar;

/*		TweenMax.to($(this).children('.menu-toggle-icon'),0.4,{
			rotation:onRunCar?45:0,
			ease:Quint.easeInOut,
			force3D:true
		});*/

		onRunCar?openMenu():closeMenu();
	});




	lightingBtn.on("mousedown",function () {

		menuItem=$(".lightingItem");
		menuToggleBTN=lightingBtn;
		menuItemNum=menuItem.length;

		angle=180;
		distance=90;
		startingAngle=180+(-angle/2);
		slice=angle/(menuItemNum-1);

		menuItemAngle();
			
		onRunCar=!onRunCar;

		TweenMax.to($(this).children('.menu-toggle-icon'),0.4,{
			rotation:onRunCar?45:0,
			ease:Quint.easeInOut,
			force3D:true
		});

		onRunCar?openMenu():closeMenu();
	});




	annotationsBtn.on("mousedown",function () {
		

		menuItem=$(".annotationsItem");
		menuToggleBTN=annotationsBtn;
		menuItemNum=menuItem.length;

		angle=180;
		distance=90;
		startingAngle=180+(-angle/2);
		slice=angle/(menuItemNum-1);

		menuItemAngle();
			
		onannotations=!onannotations;
		onannotations?openMenu():closeMenu();
	});








	function menuItemAngle() {
		menuItem.each(function(i){
			var angle=startingAngle+(slice*i);
			$(this).css({
				transform:"rotate("+(angle)+"deg)"
			})
			$(this).find(".menu-item-icon").css({
				transform:"rotate("+(-angle)+"deg)"
			})
		})
	}








	function openMenu(){
		menuItem.each(function(i){
			var delay = i*0.05;

			var $bounce=$(this).children(".menu-item-bounce");


			TweenMax.fromTo($bounce,0.2,{
				transformOrigin:"50% 50%"
			},{
				delay:delay,
				scaleX:0.8,
				scaleY:1.2,
				force3D:true,
				ease:Quad.easeInOut,
				onComplete:function(){
					TweenMax.to($bounce,0.15,{
						// scaleX:1.2,
						scaleY:0.7,
						force3D:true,
						ease:Quad.easeInOut,
						onComplete:function(){
							TweenMax.to($bounce,3,{
								// scaleX:1,
								scaleY:0.8,
								force3D:true,
								ease:Elastic.easeOut,
								easeParams:[1.1,0.1]
							})
						}
					})
				}
			});

			TweenMax.to($(this).children(".menu-item-button"),0.5,{
				delay:delay,
				y:distance,
				force3D:true,				
				scale:0.9,
				ease:Elastic.easeOut,
				easeParams:[1.1,0.4]






			});
		})
	}
	function closeMenu(){
		menuItem.each(function(i){
			var delay=i*0.08;

			var $bounce=$(this).children(".menu-item-bounce");

			TweenMax.fromTo($bounce,0.2,{
				transformOrigin:"50% 50%"
			},{
				delay:delay,
				scaleX:1,
				scaleY:0.8,
				force3D:true,
				ease:Quad.easeInOut,
				onComplete:function(){
					TweenMax.to($bounce,0.15,{
						// scaleX:1.2,
						scaleY:1.2,
						force3D:true,
						ease:Quad.easeInOut,
						onComplete:function(){
							TweenMax.to($bounce,3,{
								// scaleX:1,
								scaleY:1,
								force3D:true,
								ease:Elastic.easeOut,
								easeParams:[1.1,0.1]
							})
						}
					})
				}
			});
			

			TweenMax.to($(this).children(".menu-item-button"),0.3,{
				delay:delay,
				y:0,
				force3D:true,
				ease:Quint.easeIn
			});
		})
	}
})


//BAR

$(document).ready(function() {
  var n = $(".navItem").length; // Div count
  var OW = 100/n+15; // Div over width
  TweenMax.set($(".navItem"), {
      width: 100 / n + '%'
  });
  

  $(".navItem").hover(over,out);

  function over() {
      TweenMax.to($(this), 1.0, {
          width: OW + '%'
      });
      TweenMax.to($(this).siblings(), 1.0, {
          width: (100 - OW) / (n - 1) + '%'
      })
  }

  /*$(".cicleBtn").click(out);*/

  function out() {
      TweenMax.to($(".navItem"), 0.5, {
          width: 100 / n + '%',
          ease: Back.easeOut
      })
  }
});





$(document).ready(function() {
  var n = $(".cubeFunItem").length; // Div count
  var OW = 50; // Div over width
  TweenMax.set($(".cubeFunItem"), {
      width: 100 / n + '%'
  });

  $(".cubeFunItem").hover(over,out);

  function over() {
      TweenMax.to($(this), 0.5, {
          width: OW + '%'
      });
      TweenMax.to($(this).siblings(), 0.5, {
          width: (100 - OW) / (n - 1) + '%'
      })
  }

  /*$(".cicleBtn").click(out);*/

  function out() {
      TweenMax.to($(".cubeFunItem"), 0.5, {
          width: 100 / n + '%',
          ease: Back.easeOut
      })
  }
});