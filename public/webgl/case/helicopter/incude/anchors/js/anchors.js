


	_papersheet= $(".papersheet");
	_trigger= $(".papersheet__trigger");


	_trigger.click(anchorsOnOff);

	function anchorsOnOff() {
	  if (_papersheet.hasClass("opened")) {
	    $(this).parent(".papersheet").stop().removeClass("opened");

	    $(this).children("i").stop().removeClass("lf-close").toggleClass( "lf-tip" );
	    
	  } else {
	    $(this).parent(".papersheet").stop().addClass("opened");

	    $(this).children("i").stop().removeClass("lf-tip").addClass( "lf-close" );



	    
	  }
	}






	var annotationsCont = $(".annotationsCont");
	var papersheet = $(".papersheet");

	var annotationsAnim = $(".annotationsAnim");

	var annotationsOn = $(".annotationsOn");
	var annotationsOff = $(".annotationsOff");



	function eachRandom() {

		papersheet.each(function( index ) {

			var randomAnim = Math.max( 1.0, Math.random(index) * 2 ) ;

			$( this ).css("-webkit-animation-duration", randomAnim +"s");


		})
	}








$(document).ready(function() {




	var annotationstop = 100;
	var annotationsOP = 1;






	var annotationsAnimShow;



	annotationsOn.click(function () {

		TweenMax.to(annotationsAnim,1,{opacity:1} );

		annotationsAnimShow = TweenMax.from(annotationsAnim,2,{top:-annotationstop,opacity:1,ease:Power2.easeInOut});




	})


	annotationsOff.click(function () {


		TweenMax.to(annotationsAnim,2,{top:-annotationstop,opacity:1,ease:Power2.easeInOut} );

		TweenMax.to(annotationsAnim,1,{opacity:0,delay:1} );

		/*annotationsAnimShow.reverse();*/





	})




});
