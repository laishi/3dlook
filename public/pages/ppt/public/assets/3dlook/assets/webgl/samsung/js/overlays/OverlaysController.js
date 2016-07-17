var OverlaysController;

(function($) {

  var facebookBtn = document.getElementById("js-exfacebookBtn");
  var twitterBtn = document.getElementById("js-extwitterBtn");


  var copyScreen = document.getElementById("js-introCopyScreenAlignVert");

  var copyPaste =  document.getElementById("js-copypaste");

  var typeCurrentlyOpen = ""
// 

  facebookBtn.addEventListener( "click" , shareFacebookHandler );
  twitterBtn.addEventListener( "click" , shareTwitterHandler );

  twitterBtn.style.cursor = "pointer";
  facebookBtn.style.cursor = "pointer";


  var btnHooks = document.getElementsByClassName("buttonsOversHook" );

  function shareFacebookHandler( e ) {
    //trace( "shares")
    var left = screen.width/2 - 550/2
    var top = screen.height/2 - 420/2
    
    var popup = window.open( 'https://www.facebook.com/sharer/sharer.php?u=tryonasix.com', 'FacebookWindow', "top="+top+", left="+left+", width=550, height=420" );
		popup.focus();
  }

  function shareTwitterHandler( e ) {
    //trace( "shares")
    var left = screen.width/2 - 550/2
    var top = screen.height/2 - 420/2

    var popup =  window.open( "https://twitter.com/intent/tweet?text=I%20just%20tried%20out%20the%20S%C2%AE6%20Edge%20at%20tryonasix.com.%0A%23GalaxyS6Edge&related=twitterdev,twitterapi", "TwitterWindow", "top="+top+", left="+left+", width=550, height=420" );
		popup.focus();
  }

  var wrongBrowserScreen = false
  $overlaysContainer = $('#overlays-container');

  var hooks = document.getElementById( "overlays-container")
  $overlaysBackground = $('#overlays-background');

  $dropDowns =  $('#device-dropdown');
  $dropDowns2 =  $('#carrier-dropdown');


  $shopNowButton = $('#shop-now-button');
  $shopNowButtonWB = $('#shop-now-buttonWB');
  
  $shopNowOverlay = $('#try-the-real-thing');

  $shareButton = $('#share-button');
  $shareOverlay = $('#share-this-experience');

  $letsGo = $('#letsGo')

  TweenLite.set( $letsGo , { z:-1 })

  var currentActiveOverlay;

  $overlaysBackground.on('click', function() {

    hideCurrentOverlay();
  });

  $shopNowButton.on('click', function() {

     trace( "CCCCClickssss")
    showOverlayByName('shopNow');
  });

  $shopNowButtonWB.on('click', function() {
    wrongBrowserScreen = true
    showOverlayByName('shopNow');
  });

  $shareButton.on('click', function() {
    showOverlayByName('share');
  });

  var overlays = {
    shopNow: $shopNowOverlay,
    share: $shareOverlay,
  };

  var animateInDuration = 0.2;

  function hideNavBtns() {
     var len = btnHooks.length;
     for( var i = 0 ; i < len ; i ++ ) {
        btnHooks[i].isenabled = false
        TweenLite.to( btnHooks[i] , .5 , { opacity:0 })
     }
  }

  function showNavBtns() {
     var len = btnHooks.length;
     for( var i = 0 ; i < len ; i ++ ) {

        btnHooks[i].isenabled = true
        TweenLite.to( btnHooks[i] , .5 , { opacity:.7 })
     }
  }

  function showOverlayByName(name) {
    hooks.style.display = "block";
    FeaturesController.hideAll();

    trace( "open overlays")

    var $overlay = overlays[name];

    if ($overlay == currentActiveOverlay) return;

    hideCurrentOverlay();

    $overlaysBackground.css({pointerEvents: 'all'});
    $overlay.css({display: 'block', pointerEvents: 'none' });
    typeCurrentlyOpen = name;

    if( name == "share"){
        $dropDowns.css({pointerEvents: 'none'});
        $dropDowns2.css({pointerEvents: 'none'});
        $letsGo.css({pointerEvents: 'none'});
        facebookBtn.style.pointerEvents = "auto"
        twitterBtn.style.pointerEvents = "auto"

        copyPaste.style.pointerEvents = "auto"
    }else{
       $dropDowns.css({pointerEvents: 'all'});
      $dropDowns2.css({pointerEvents: 'all'});
      $letsGo.css({pointerEvents: 'all'});
      facebookBtn.style.pointerEvents = "none"
        twitterBtn.style.pointerEvents = "none"
        copyPaste.style.pointerEvents = "none"
    }
    

    TweenLite.to($overlay[0], animateInDuration, {
      opacity: 1,
    });


    if(  wrongBrowserScreen == true ) {

    }

    if( isIntoOpen == true && wrongBrowserScreen == false) {
        TweenLite.to(copyScreen, animateInDuration, {
      opacity: 0,
      });

      TweenLite.to($overlaysBackground[0], animateInDuration, {
      opacity: 0.1,
      });
    }else if( wrongBrowserScreen == true ){
       TweenLite.to($overlaysBackground[0], animateInDuration, {
      opacity: 0.9,
      });
    }

    else{
      TweenLite.to($overlaysBackground[0], animateInDuration, {
      opacity: 0.5,
      });
      exPublicApi.hideMouseSwitcher();
      DotMenuView.closeView();
    }
   
    hideNavBtns()

    currentActiveOverlay = $overlay;
  }

  function hideCurrentOverlay() {
    if (!currentActiveOverlay) return;

    showNavBtns()

    $overlaysBackground.css({pointerEvents: 'none'});
    currentActiveOverlay.css({pointerEvents: 'none'});

    $dropDowns.css({pointerEvents: 'none'});
    $dropDowns2.css({pointerEvents: 'none'});
     $letsGo.css({pointerEvents: 'none'});

     facebookBtn.style.pointerEvents = "none"
        twitterBtn.style.pointerEvents = "none"

    TweenLite.to(currentActiveOverlay[0], animateInDuration, {
      opacity: 0,
    })

    TweenLite.to($overlaysBackground[0], animateInDuration, {
      opacity: 0,
    });

    currentActiveOverlay = null;

     if( isIntoOpen == true ) {
        TweenLite.to(copyScreen, animateInDuration, {
      opacity: 1,
      });
    }else{
       DotMenuView.openView();
       exPublicApi.showMouseSwitcher()
    }

    var testId = exPublicApi.getCurrentId()
    if( testId != "notInRange") {

      var internalId = FeaturesData[testId].id
       FeaturesController.showFeatureById(  [internalId]  )
    }

    //trace( exPublicApi.getCurrentId() + " exPublicApi.getCurrentId from ex " )
    typeCurrentlyOpen = "";

  }

  // buy now dropdowns

  var config = {
    device: null,
    carrier: null,
  };

  var urls = {
    "galaxyS6": {
      "amazon": "http://www.amazon.com/b/?ie=UTF8&node=11275476011&pf_rd_p=2066368962&pf_rd_s=merchandised-search-3&pf_rd_t=101&pf_rd_i=2335752011&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=0D6S8N56FM3RNVXSWC0T&ref_=acs_ux_hsb_5s_2_s_WL-CPA-BB4",
      "sprint": "http://www.sprint.com/landings/samsung-next-big-thing/index.html?ECID=vanity:galaxys6",
      "costco": "http://membershipwireless.com/index.cfm/",
      "att": "http://www.att.com/cellphones/samsung/galaxy-s6.html",
      "bestbuy": "http://www.bestbuy.com/site/promo/samsung-galaxy-s6-edge-and-samsung-galaxy-s6",
      "samsClub": "http://www.samsclub.com/sams/pagedetails/content.jsp?pageName=samsung&cid=INT_HM_3UP_S6",
      "target": "http://www.target.com/sb/phones-with-plans-cell-electronics/samsung/-/N-5xte5Z5y4wr/sb/%20URL:%20/Nf-P_ProductOfferMinPrice%7CBTWN+199+300#?lnk=snav_032915_Elect_GS6Preorder_Bnr_2&intc=2409051",
      "tmobile": "http://www.t-mobile.com/cell-phones/samsung-galaxy-s-6.html",
      "usCellular": "http://www.uscellular.com/samsung/samsung-galaxy-s6.html",
      "verizon": "http://www.verizonwireless.com/smartphones/samsung-galaxy-s6/",
      "walmart": "http://www.walmart.com/cp/1229670",
    },
    "galaxyS6edge": {
      "amazon": "http://www.amazon.com/b/?ie=UTF8&node=11275476011&pf_rd_p=2066368962&pf_rd_s=merchandised-search-3&pf_rd_t=101&pf_rd_i=2335752011&pf_rd_m=ATVPDKIKX0DER&pf_rd_r=0D6S8N56FM3RNVXSWC0T&ref_=acs_ux_hsb_5s_2_s_WL-CPA-BB4",
      "sprint": "http://www.sprint.com/landings/samsung-next-big-thing/index.html?ECID=vanity:galaxys6#!/",
      "costco": "http://membershipwireless.com/index.cfm/",
      "att": "http://www.att.com/cellphones/samsung/galaxy-s6-edge.html",
      "bestbuy": "http://www.bestbuy.com/site/promo/samsung-galaxy-s6-edge-and-samsung-galaxy-s6",
      "samsClub": "http://www.samsclub.com/sams/pagedetails/content.jsp?pageName=samsung&cid=INT_HM_3UP_S6",
      "target": "http://www.target.com/sb/phones-with-plans-cell-electronics/samsung/-/N-5xte5Z5y4wr/sb/%20URL:%20/Nf-P_ProductOfferMinPrice%7CBTWN+199+300#?lnk=snav_032915_Elect_GS6Preorder_Bnr_2&intc=2409051",
      "tmobile": "http://www.t-mobile.com/cell-phones/samsung-galaxy-s-6-edge.html",
      "usCellular": "http://www.uscellular.com/samsung/samsung-galaxy-s6.html",
      "verizon": "http://www.verizonwireless.com/smartphones/samsung-galaxy-s6-edge/",
      "walmart": "http://www.walmart.com/cp/1229670",
    },
  };



  function rotateArrows( arrowElement , configField , rotationValue ) {
      TweenLite.to( arrowElement , .5 , {rotation: rotationValue})
  }

  function dropdown(element, configField) {

    var open = false;
    var selected = null;
    var $header = element.find('.dropdown-heading');
    var $itemsContainer = element.find('.dropdown-items');
    var $items = element.find('.list-item');

    var arrowElement;
    if( configField == "device"){
       arrowElement = document.getElementById("js-exDropDownArrow0")

    }else{
       arrowElement = document.getElementById("js-exDropDownArrow1")
    }

    //console.log("dropdown heading height", $header.height);
    $itemsContainer.css({height: 0});

    $header.on('click', function(e) {
      var fullItemsHeight = $itemsContainer.children().length * $header.height();
      $itemsContainer.css({height:  open ? 0 : fullItemsHeight});
      
      open = !open;

      if( open == false ) {
         rotateArrows( arrowElement , configField , 0 ) 
      }else{
         rotateArrows( arrowElement , configField , 180 ) 
      }
      
    });

    $items.on('click', function(e) {
      open = false
      rotateArrows( arrowElement , configField , 0 ) 
      
      $items.removeClass('item-selected');
      $(this).addClass('item-selected');
      element.find('.dropdown-heading img').attr({src: $(this).attr('src')});
      $itemsContainer.css({height: 0});

      config[configField] = $(this).data('value');

      if (config.device && config.carrier) {
        showLetsGo();
      }

    });

    function showLetsGo() {
      $('.lets-go').css({opacity: 1});
      // TweenLite.set( $letsGo , { opacity:1 })
    };

  };

  $('.lets-go').on('click', function(e) {
    if (config.device && config.carrier) {
      var url = urls[config.device][config.carrier];
      window.open(url);
    }
  });

  dropdown($('#device-dropdown'), 'device');
  dropdown($('#carrier-dropdown'), 'carrier');

}).call(null, jQuery);
