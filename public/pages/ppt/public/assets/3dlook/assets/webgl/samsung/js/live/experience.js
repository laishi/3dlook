//TODO: Move to proper constructor
var accesoriesModel, phoneModel, projector, effectVignette, composer, planeMesh, camera, vignetteMesh, secondCircle, circle, rotationX, rotationY, rotationZ, not, time, cameraZone, screenZone, chargerZone, descriptionPopup, group, featureOn, labelMesh, line;
var featureObjMap, currentFeatureObj, perpLine;
var frontFaceTriggeredZones, bottomEdgeTriggeredZones, rightEdgeTriggeredZones, activeFeatureList;
var frontFaceTriggerRayMarker, bottomEdgeTriggerRayMarker, rightEdgeTriggerRayMarker;
var mCover, mFace, mScreen, mCamera, mCase1, mCase2, mBlock, mLogo, mButton, mGlass, mBattCap, mBattBdy, mBattCnd, mSDcard, mPenLogo, mPenHand;
var mPenNip, mPenCap, mPenBody, wPen, wBattery, wSDcard;

var frontFace, glass, screenFace, body, chrome, stripes, buttons, chromeTrim, screenPink, screenMideBlack, logo;
var chargerModel, chargerSamsungLogo, chargerCenterRubber, chargerGlass, chargerBottom, chargerLighting, chargerCable;
var usbChargerModel, usbChargerBody, usbChargerConnection;

var isIntoOpen = true
 $('.loading').fadeIn();
var exPublicApi = {}
'use strict';
if (!ssHQ) {
    var ssHQ = $;
}
var loading = true;
time = 1;
not = false;
hidding = false;
//testtsdsdssddsssseeeedddsdeed


(function($) {
    /* global window, setTimeout, setInterval, //console, Modernizr, clearTimeout
     April 28th 2015*/
    /**
    @class $.main
    @constructor
    @param {Object} params External object settings passed into the object.
    **/
    'use strict';
    $.main = function(params) {
        /**
        Globals
        **/
        'use strict';

        SubHeaderSwitcher.init()
        

        var container = $('.canvas-container'),
            wrapper = $('#wrapper'),
            dpr,
            showFeatures = false,
            effectFXAA,
            renderScene,
            stats,
            scene,
            raycaster,
            renderer,
            activeFeatureList = [],
            userPhone = 'generic',
            targetObject,
            targetPhoneObject,
            angle = 0,
            mouseX = 0,
            mouseY = 0,
            zoomMaxLimit = 0,
            zoomMinLimit = 8,
            verticalMaxLimit = 3.5,
            verticalMinLimit = -2.5,
            windowHalfX = window.innerWidth / 2,
            windowHalfY = window.innerHeight / 2,
            spotLight,
            ambientLight,
            pointLight;

        var moonGlow;
        var loaderCharger;

        var hasMouseMoveListener = false;

        var backgrounds = [];

        var css3renderer;
        var sceneCSS;

        var cameracss3;

       // DotLabelView.init();

       

        var contentPointer = document.getElementById( "content-container" )

        var introCopyScreenAlignVert = document.getElementById( "js-introCopyScreenAlignVert" );


        var wrongScreen = document.getElementById( "js-wrongbrowserphone" );


        var wrongScreenText = document.getElementById( "js-wrongBrowser" );


        var legal = document.getElementById( "available-on-edge2" );


        var disclaimer = document.getElementById( "js-disclaimer" );


        var soldSeperately = document.getElementById( "available-on-edge" );
        

        var whaleLegal = document.getElementById( "whale_legal" );
       

        var volumeMuted = false;

        var muteBtn = document.getElementById( "js-muteBtn" )
        

        function toggleSoundHandler() {

            if( volumeMuted == true ) {
                volumeMuted = false
                //trace( "BOOOM MAKE LOUDSSSPPPP_______lets control sounds!!!!!!!!!")
                GlobalVolumeController.setVolume( 1 )
                 muteBtn.style.backgroundImage = "url('designassets/Global/icn_audio_on.png')"
            }else{
                volumeMuted = true;
                //trace( "eppp lets be quiets ok?  lets control sounds!!!!!!!!!")

                muteBtn.style.backgroundImage = "url('designassets/Global/icn_audio_off.png')"
                GlobalVolumeController.setVolume( 0 )
            }
        }
      // BackGroundLightView.init();



      //  TweenLite.set( exsiteBackgroundOverlayBottom , { xPercent:-50})

        var excontrollerSwitcher = document.getElementById( "js-excontrollerSwitcher" )
        var excontrollerSwitcherMouse = document.getElementById( "js-excontrollerSwitcherMouse" )
        var excontrollerSwitcherPhone = document.getElementById( "js-excontrollerSwitcherPhone" )
       

        var useMouseLabel = document.getElementById( "js-useMouse" )
        var usePhoneLabel = document.getElementById( "js-usePhone" )

        var excontrollerSwitcherTextLabels = document.getElementById( "js-excontrollerSwitcherTextLabels" )
       
     //, trans   excontrollerSwitcherTextLabels


        var overElements = []
        var overElements = document.getElementsByClassName( "buttonsOversHook")

        for( var i = 0 ; i < overElements.length; i ++ ) {
            var ref = overElements[i]
            ref.id = i;
            ref.isenabled = true;
            TweenLite.set( ref ,  { opacity:.7})
            ref.addEventListener( "mouseenter" , mouseOverEventHandler )
            ref.addEventListener( "mouseleave" , mouseOutEventHandler )
        }

        function mouseOverEventHandler( e ) {
            //trace( "overs")

            var id = e.currentTarget.id;
            var ref = overElements[id];
             if( ref.isenabled == true ) {
                 TweenLite.to( ref , .2 , { opacity:1})
             }

        }

        function mouseOutEventHandler( e ) {

            var id = e.currentTarget.id;
            var ref = overElements[id];
            if( ref.isenabled == true ) {
                 TweenLite.to( ref , .2 , { opacity:.7})

             }
        }
        

        function overDeviceHandler( e ) {
            TweenLite.to( excontrollerSwitcher, .2 , { opacity:1})
            if( excontrollerSwitcherMouse.style.display == "block" ) {
                TweenLite.to( useMouseLabel , .2 , { opacity:1})

            }else{
                TweenLite.to( usePhoneLabel , .2 , { opacity:1})
            }
        }

        function outDeviceHandler( e ) {
            TweenLite.to( excontrollerSwitcher, .2 , { opacity:.6})
            if( excontrollerSwitcherMouse.style.display == "block" ) {
                TweenLite.to( useMouseLabel , .2 , { opacity:0})

            }else{
                TweenLite.to( usePhoneLabel , .2 , { opacity:0})
            }
        }




        function toggleControllerDeviceHandler( e ) {
            if( excontrollerSwitcherMouse.style.display == "none" ){
                switchToDevice()
            }else{
                switchToMouse()
            }

            TweenLite.to( useMouseLabel , .2 , { opacity:0})
            TweenLite.to( usePhoneLabel , .2 , { opacity:0})
        }


       
        function myFocusFunction() {
            //trace( "FOCUS")
            if( volumeMuted == false ) {
               
                //trace( "BOOOM MAKE LOUDSSSPPPP_______lets control sounds!!!!!!!!!")
                GlobalVolumeController.setVolume(1 )
            }
        }
        function myBlurFunction() {
            //trace( "BLURRRS")

            if( volumeMuted == false ) {
               
                //trace( "BOOOM MAKE LOUDSSSPPPP_______lets control sounds!!!!!!!!!")
                GlobalVolumeController.setVolume( 0 )
            }
        }

        var masterObject

        var slerpMaster

        var slerpIphone;
        var slerpAndriod;
        var slerpMouse;
        var mouse = false;

        var INPUTMODE = "mouse"

       // var backgrounds

        var alpha, beta, gamma, orient;

        var server = connection_url || " ";
        if (server == ' ') {
            server = 'http://' + window.location.host;
            if (server.indexOf('localhost')>-1 && server.indexOf('8081')==-1) server+=":8081";
        }
        var isConnected = false;

        var isSocketSetUp = false;

        var socket = io(server), //io(server),
            isConnected = false,
            uid = '',
            test = '';

        var isSceneSetUp = false;

        var enterMouseBtn = document.getElementById( "js-enterMouseBtn" );

        

       
        function initAfterDetects() {
            window.addEventListener("focus", myFocusFunction, true);
            window.addEventListener("blur", myBlurFunction, true);

            enterMouseBtn.addEventListener( "mousedown", switchToMouse)
            TweenLite.set( excontrollerSwitcher , { scale:.7 })

            excontrollerSwitcher.addEventListener( "mousedown" , toggleControllerDeviceHandler , false)
            excontrollerSwitcher.addEventListener( "mouseenter" , overDeviceHandler , false)
            excontrollerSwitcher.addEventListener( "mouseleave" , outDeviceHandler , false)

             TweenLite.set( excontrollerSwitcherMouse , {scale:.7 , transformOrigin: "top left" })
            TweenLite.set( excontrollerSwitcherPhone , {scale:.7 , transformOrigin: "top left" })
             TweenLite.set( excontrollerSwitcherTextLabels , {scale:.5 , transformOrigin: "top left" })
             muteBtn.addEventListener( "mousedown" , toggleSoundHandler )
              TweenLite.set(  whaleLegal , { xPercent:-50 })

               TweenLite.set( introCopyScreenAlignVert , { yPercent:-50})
             TweenLite.set( wrongScreen , { yPercent:-50})
            TweenLite.set( wrongScreenText , { yPercent:-50})
            TweenLite.set( legal , { xPercent:-50})
             TweenLite.set( disclaimer , { xPercent:-50 , opacity: 0})
            TweenLite.set( soldSeperately , { xPercent:-50 })
            masterObject =  new THREE.Object3D();

            sceneCSS = new THREE.Scene();

            cameracss3 = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
            cameracss3 .position.set( 0, 0, 900 );
        }

        /**
        Initializaiton function which runs at object instantiation time.

        @method init
        **/
        function init() {

            //trace( "INITSSSSSSSSSS_________________________")
           // Detector.webgl = false

            if (wrapper && supportedBrowser() && Detector.webgl) {
                var timeout = setTimeout(function() {
                    clearTimeout(timeout);
                    containerHeight();
                    $("html,body").animate({
                        //scrollTop: wrapper.offset().top
                    }, 300);
                }, 1500);
            }

            if (supportedBrowser() && Detector.webgl) {
                loading = true;
                //trace( " ready to rawks")
                initAfterDetects()
                DrawMaterialView.init()
                SuccessView.init()
                CheckRange.setFuctionPointers( checkRangeUpdateById, nullRange);

                DotMenuView.init( FeaturesData, shuttleToPosition );
                isSocketSetUp = true
                guidCall(function() {
                    socketSetup();
                    setUp();
                    animate();
                    bindEvents();


                } )


                $('.content').addClass('introduction');
               // introBG();
                containerHeight();
            } else {
                
                altContent();
                $(window).resize(function() {
                    $('video').redraw();
                });
                /*
                $('a.safari').click(function(event) {
                   // event.preventDefault();
                   // safariInstructions();
                });

*/

                $('.loading').fadeOut();
            }


        }



        function switchToMouse() {
            var ambientAudioElement = document.getElementById( "js-mainAmbientLoop" )
            ambientAudioElement.play();
            //trace( loading + "  is this loading")
            if( loading == false )
            {
                showMouseSwitcher()

                SubHeaderSwitcher.setMouse()

                 mouse = true;

                 contentPointer.classList.add( "customDragOver" );

                TweenMax.killTweensOf( slerpIphone );
                TweenMax.killTweensOf( slerpAndriod );
                TweenMax.killTweensOf( slerpMouse );

                TweenMax.killTweensOf(phoneModel );
                TweenMax.killTweensOf(targetObject);
               
                  TweenMax.set(phoneModel.rotation,  {           
                        z: 0.7002946608144802  ,
                        x:-0.655430732691096,
                        y: 0.648439847155683      
                    });


                TweenMax.set(targetObject.rotation,  {           
                        z: 0,
                        x: 89 * (Math.PI / 180),
                        y: 0        
                    });


                nullRange()
                if( currentId != "notInRange"){
                   // checkRangeUpdateById( currentId )
                }

                previousMousePosition = {
                    x: 1,
                    y: 1
                };

                //trace( " switchToMouse")
               // showFeatures = true
                hideIntroScreenMouse();
                onWindowResize()

              //  currentId = 0;
                 DotMenuView.openView()
                 DotMenuView.setMouse();
                // shuttleToPosition( 0 )
                 //DotMenuView.setSelect( 0 )
                 TweenLite.delayedCall( 1, delayedShuttleToId)
                
                 excontrollerSwitcherMouse.style.display = "none"
                 excontrollerSwitcherPhone.style.display = "block"
                 addMouseEvents()
               }

        }

        function delayedShuttleToId() {
             shuttleToPosition( 1 )
             DotMenuView.setSelect( 1 )
        }

        function switchToMouseTest(){
            //hideIntroScreenMouse();

           // addMouseEvents()



        }

        function showMouseSwitcher() {

            TweenLite.set( excontrollerSwitcher,  { opacity:0 })
            excontrollerSwitcher.style.display = "block"

            TweenLite.to( excontrollerSwitcher, .5 , { opacity:.7 , delay:.8})
        }

        function hideMouseSwitcher() {

            //TweenLite.set( excontrollerSwitcher,  { opacity:0 })
            excontrollerSwitcher.style.display = "block"

            TweenLite.to( excontrollerSwitcher, .5 , { opacity:0 , delay:0})
        }

        function switchToDevice() {

            SubHeaderSwitcher.setDevice()
            var ambientAudioElement = document.getElementById( "js-mainAmbientLoop" )
            ambientAudioElement.play();
            showMouseSwitcher()
            contentPointer.classList.remove( "customDragOver" );
            TweenMax.killTweensOf( slerpIphone );
            TweenMax.killTweensOf( slerpAndriod );
             TweenMax.killTweensOf( slerpMouse );

            TweenMax.killTweensOf(phoneModel );
            TweenMax.set(phoneModel.rotation,  {           
                    z: 0,
                    x: 0,
                    y: 0        
                });

           
            nullRange()

            if( currentId != "notInRange"){
                //checkRangeUpdateById( currentId )
            }
            /*
            previousMousePositionM = {
                x: 1,
                y: 1
            };

            */


            mouse = false;
            //trace( " switchToDevice")
            excontrollerSwitcherPhone.style.display = "none"
            excontrollerSwitcherMouse.style.display = "block"
            if( isSocketSetUp == false ) {

            }

            if (!isConnected) {
                 $('.content').addClass('introduction');
                 showIntroScreen()
                 DotMenuView.closeView()
            }else{
                 DotMenuView.openView()
                DotMenuView.setDevice();
            }



        }

        var loadingPercentageDone = false;
        function loadingPercentageComplete() {
            loadingPercentageDone = true;
            removeLoader();
        }

        function removeLoader(){
           // loading = false;
            //trace( "remove loader call from experience js")


            if( loadingPercentageDone == true && loading == false ){

                     $('.loading').fadeOut(600);
                   
                    if (isConnected){
                        //$('.canvas-container').fadeIn();
                         $('.loading').fadeOut(600);
                    }

             }
        }


        /**
        @function socketSetup
        Sets up socket connection and listens for events
        **/

        var redundancychecks = 1
        function socketSetup() {
            $( window ).unload(function() {
                socket.emit('client_deregistration', {
                    clientType: 'clientType_receiver',
                    uid: uid
                });
            });

            //trace( "socketSetup"  )

            socket.on('error', function() {
                //trace(  "socket errors")
            });

            socket.on('connect', function() {
                //console.log('socketsetup',uid);
                //trace( "redundancychecks " + redundancychecks)
                redundancychecks = redundancychecks +1;
                socket.emit('client_registration', {
                    clientType: 'clientType_receiver',
                    uid: uid
                });
            });
           socket.on("zoomIn", incrementZoom);
            socket.on("zoomOut", decrementZoom);
            socket.on("moveUp", moveDeviceUp);
            socket.on("moveDown", moveDeviceDown);
            socket.on('update', function(msg) {


                if( mouse == false )
                {

                    msg.orientation.toString = function() {
                        return " x: " + msg.orientation.x + " y: " + msg.orientation.y + " z: " + msg.orientation.z;
                    };

                    if (!isConnected) {
                       // setUserPhoneMsg( msg )
                       //trace( "run onces")
                       var ambientAudioElement = document.getElementById( "js-mainAmbientLoop" )
                       ambientAudioElement.play();
                        DotMenuView.openView()
                        DotMenuView.setDevice();
                         SubHeaderSwitcher.setDevice()
                        isConnected = true;
                        excontrollerSwitcherPhone.style.display = "none"
                        excontrollerSwitcherMouse.style.display = "block"
                        showMouseSwitcher()
                        if (msg.quaternion) {
                             TweenMax.set(phoneModel.rotation,  {           
                                z: 0,
                                x: 0,
                                y: 0        
                             });
                         }else{

                            TweenMax.set(phoneModel.rotation,  {           
                                z: 0.7002946608144802  ,
                                x:-0.655430732691096,
                                y: 0.648439847155683      
                            });

                         }

                        hideIntroScreen();
                    }




                    //ROTATE.
                   not = true;
                    if (targetObject) {
                        //var deviceEuler = new THREE.Euler();

                        alpha = THREE.Math.degToRad(msg.orientation.alpha); // Z
                        beta = THREE.Math.degToRad(msg.orientation.beta); // X'
                        gamma = THREE.Math.degToRad(msg.orientation.gamma); // Y''
                        orient = THREE.Math.degToRad(msg.orientation.orient); // O

                        if (msg.quaternion) {
                           // //trace( " msg.quaternion ")
                           // var deviceMatrix = createRotationMatrix(alpha, beta, gamma, orient);
                            slerpIphone = {
                                percentage: 0
                            };
                            var destinationQuaternion = new THREE.Quaternion();
                            var sleprQuaternion = new THREE.Quaternion();

                            destinationQuaternion.set(msg.quaternion.x, msg.quaternion.y, msg.quaternion.z, msg.quaternion.w);

                            TweenMax.to(slerpIphone , 1, {
                                percentage: 1,
                                onUpdate: function() {
                                    if( mouse == false )
                                    {
                                            THREE.Quaternion.slerp(targetObject.quaternion, destinationQuaternion, sleprQuaternion, slerpIphone.percentage);
                                             targetObject.quaternion.copy(sleprQuaternion);

                                         }
                                }
                            });

                           checkRange()


                        } else {
                           // //trace ( 'sockets ' + gamma)

                            var deltaMove = {
                                x: gamma-previousMousePositionM.x,
                                y: beta-previousMousePositionM.y
                            };



                                var deltaRotationQuaternion = new three.Quaternion()
                                    .setFromEuler(new three.Euler(
                                        toRadians(deltaMove.y * 1),
                                        toRadians(deltaMove.x * 1),
                                        0,
                                        'XYZ'
                                    ));




                                slerpAndriod = {
                                                percentage: 0
                                            };

                                           // var sleprQuaternion = new THREE.Quaternion();

                                         //   sleprQuaternion = new THREE.Quaternion().copy(phoneModel.quaternion)

                                            TweenMax.to(slerpAndriod , .5, {
                                                percentage: 1,
                                                onUpdate: function() {


                                                    phoneModel.quaternion.multiplyQuaternions(deltaRotationQuaternion, phoneModel.quaternion);
                                                }
                                            });


                              checkRangeM();





                            previousMousePositionM = {
                                x: gamma,
                                y: beta
                            };


                        }

                    }
                    if (showFeatures) {

                        testShowFeatures()
                    }

                }



            });
        }
        var currentId = "notInRange"

        window.spec = function(id) {
          socket.emit('spec', {
            spec: id,
            uid: uid,
          });
        };


        function globalVolumeUpdateHandler( vol ) {
            if ( currentId != "notInRange" ) {
                DrawMaterialView.updateVolume( vol )
            }

            DrawMaterialView.updateVolumeAmbient( vol )

        }

        GlobalVolumeController.setGlobalUpdateFunction( globalVolumeUpdateHandler )

        function checkRangeUpdateById( id ) {
            ////trace( currentId + " update function " + id )
            if ( currentId !=  id  ){
                currentId = id
                //FeaturesController.hideAll()

                var internalId = FeaturesData[id].id
                 var screenId = FeaturesData[id].screenId
                 checkForCharger( internalId )

                 checkForUSBCharger (internalId )
                //
                socket.emit('spec', {
                  spec: internalId,
                  uid: uid,
                });
                 DrawMaterialView.closeView( internalId )
                 DrawMaterialView.openById( internalId , screenId)
                 FeaturesController.showFeatureById(  [internalId]  )
                 DotMenuView.setSelect( internalId )

                 if( internalId == 2 ){
                    showPink()
                }

                if( id == 3 ) {
                      TweenLite.to( disclaimer , .5 , { opacity:1 })
                    }else{
                      TweenLite.to( disclaimer , .5 , { opacity:0 })
                    }

                 if( id == 0 ) {
                      TweenLite.to( whaleLegal , .5 , { opacity:1 })
                    }else{
                      TweenLite.to( whaleLegal , .5 , { opacity:0 })
                    }
             //   DotLabelView.openView( id )
                currentRotationCorrds.z = FeaturesData[id].mouseUpShuttle.position.z;
                currentRotationCorrds.x = FeaturesData[id].mouseUpShuttle.position.x;
                currentRotationCorrds.y = FeaturesData[id].mouseUpShuttle.position.y;
                //trace( currentRotationCorrds.x + " currentRotationCorrds.x" + FeaturesData[id].mouseUpShuttle.position.z)
            }

        }


        function nullRange() {

            if( currentId != "notInRange" )
            {
                checkForCharger( "notInRange" )
                checkForUSBCharger ("notInRange" )
                currentId = "notInRange"
                 //trace( currentId + " nullRange "  )
                FeaturesController.hideAll()

                socket.emit('spec', {
                  spec: null,
                  uid: uid,
                });

                TweenLite.to( disclaimer , .5 , { opacity:0 })


                currentRotationCorrds.x = undefined
                DotMenuView.setSelect(666 )
                // DotLabelView.closeView()
                 DrawMaterialView.closeView()

                 hidePink()

            }
            ////trace( "nullRange( " + currentId )

        }


        function checkRange() {
             CheckRange.checkRangeByPhoneMesh2( targetObject )

        }

        function checkRangeM() {
            CheckRange.checkRangeByPhoneMesh( phoneModel )

        }

        function incrementZoom(val) {

                    //trace( "incrementZoom")
        }
        /**
        @function incrementZoom
        Recieves a zoom change
        **/
        function decrementZoom(val) {
           //trace( "decrementZoom")
        }

        /**
        @function moveDeviceUp
        Reduce the device
        **/
        function moveDeviceUp(val) {

            //trace( "moveDeviceUp")
        }

        function moveDeviceDown(val) {
           //trace( "movemoveDeviceDown")
        }
        // run once, used to set up the phone type for their image load in for descriptions, legacy code
        function setUserPhoneMsg( msg ) {

            // runs once break this out, this update function is absurd.
                if (!isConnected) {
                   // setTimeout(function() {
                        //showFeatures = true;
//                        //console.log("show features is now true");
                 //   }, 8000);

                    var detection = $('.detection');
                    var phoneSpan = detection.find("p span");
                    var phoneSpanLoading = $('.phone-model');
//                    //console.log(msg.brand);
                    //Process phone codes
//                    //console.log("original phone: " + msg.phone);

                    if (msg.phone !== "" || msg.devicetype=='tablet') {

                        //Filter generics
                        if (msg.phone.toLowerCase().indexOf('s5') > -1) {
                            userPhone = 'generic';
                        } else if (msg.phone.toLowerCase().indexOf('4') > -1 && msg.phone.toLowerCase().indexOf('note') > -1) {
                            userPhone = 'generic';
                        } else {
                            userPhone = msg.phone.split(' ').join('').toLowerCase();
                        }
                        //Filter Brand
                        var deviceString;
                        if (msg.brand.toLowerCase().indexOf('samsung') > -1) {
                            deviceString="Samsung device";
                            if (msg.devicetype=='tablet'){
                                userPhone='generic';
                            }
                        } else if (msg.phone.toLowerCase().indexOf('iphone') > -1) {
                            deviceString="iPhone";
                        } else {
                            var deviceString=(msg.devicetype=='tablet')?'tablet':'phone';
                            userPhone='generic';
                        }
                        phoneSpan.html(deviceString);
                        phoneSpanLoading.html(deviceString);

                    }
 //                   //console.log('features :', userPhone);
                    reloadFeatures();




                    hideIntroScreen();
                     isConnected = true;


                }

                // end run once function

        }

        function testShowFeatures() {

        }

        /**
        @function showFeature
        Displays a feature depending on which object is focused
        **/

        var currentRotationCorrds = {}


        function runOnceSetUp() {
            if( isSceneSetUp == false )
            {
                isSceneSetUp = true
            }
        }

        var specContainerPointer = document.getElementById( "specs-container" );

        function setScale( scaleAmt )
        {
            TweenLite.set( css3renderer.domElement , { scale:scaleAmt})
            TweenLite.set( specContainerPointer , { scale:scaleAmt})


            masterObject.scale.z = scaleAmt;
            masterObject.scale.y = scaleAmt;
            masterObject.scale.x = scaleAmt;

            if( scaleAmt != 1 ){
                TweenLite.set( muteBtn , {y:100 , x:162})
                TweenLite.set( excontrollerSwitcher , { y:100 ,  x:-145})
                TweenLite.set( useMouseLabel , { y:200 ,  x:-245})
                TweenLite.set( usePhoneLabel , { y:200 ,  x:-245})


            }else{
                TweenLite.set( muteBtn , { y:0 ,x:0})
                TweenLite.set( excontrollerSwitcher , {y:0 , x:0})
                TweenLite.set( useMouseLabel , {y:0 , x:0})
                TweenLite.set( usePhoneLabel , {y:0 , x:0})


            }
            

           // specs-container


        }

        /**
        @function bindEvents
        Sets up scene from three.js add render to container
        **/
        function setUp() {

            //init 3D
            //Moved camera initialization here, and out of render loop.
            //No need for it to be reset on ever render call.

            camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 1, 2000);
            camera.position.set(0, -15, 0);
            camera.up = new THREE.Vector3(0, 0, 1);

            projector = new THREE.Projector();

           // $('.progress').html('10');
            // scene

            scene = new THREE.Scene();

            ////////////////////////
            //  LIGHTS
            ////////////////////////

            // ambientLight = new THREE.AmbientLight(0xFFFFFF);
            // ambientLight.intensity = 0.5;


            var directionalLightDOWN = new THREE.DirectionalLight( 0xecfbff, .8);  //.6
            directionalLightDOWN.position.set( 0,   -.1, 1 );
            directionalLightDOWN.castShadow        = true;
            directionalLightDOWN.shadowCameraRight     =  5;
            directionalLightDOWN.shadowCameraLeft     = -5;
            directionalLightDOWN.shadowCameraTop      =  5;
            directionalLightDOWN.shadowCameraBottom   = -5;
            directionalLightDOWN.shadowCameraNear  = 0.0001;
            directionalLightDOWN.shadowDarkness    = 0.5;
            // directionalLightDOWN.shadowCameraVisible   = true;
            // directionalLightDOWN.shadowMapWidth = 1024;
            // directionalLightDOWN.shadowMapHeight    = 1024;
            // directionalLightDOWN.position.set( 0, 100, 0 ).normalize();
            scene.add(directionalLightDOWN);

            var directionalLightUP = new THREE.DirectionalLight( 0xffffff, .3 );
            directionalLightUP.position.set( 0,   0 , -1);
            scene.add(directionalLightUP);

            var directionalLightFRONTRIGHT = new THREE.DirectionalLight( 0xecfbff, 1 );  // .8
            directionalLightFRONTRIGHT.position.set( 1, -1, 0  );
            scene.add(directionalLightFRONTRIGHT);

            var directionalLightFRONTRIGHT_FILL = new THREE.DirectionalLight( 0xecfbff, 1 );
            directionalLightFRONTRIGHT_FILL.position.set( 0.5, 0, 1 );
            scene.add(directionalLightFRONTRIGHT_FILL);

            var directionalLightFRONTLEFT = new THREE.DirectionalLight( 0xecfbff, .5 );
            directionalLightFRONTLEFT.position.set( -.5, -1, 0 );
            scene.add(directionalLightFRONTLEFT);

            var directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.4 );
            directionalLight4.position.set( -1, .3,  0  );
            scene.add(directionalLight4);

            var directionalLight5 = new THREE.DirectionalLight( 0xe8edff, .3);
            directionalLight5.position.set( 0, -1,  0  );
            scene.add(directionalLight5);

            // ENVIRONMENT REFLECTION MAP SHARPS
            var path = "models/cubemap/env/";
            var format = '.jpg';
            var urls = [
                    path + 'px' + format, path + 'nx' + format,
                    path + 'py' + format, path + 'ny' + format,
                    path + 'pz' + format, path + 'nz' + format
                ];
            var reflection_Sharp = THREE.ImageUtils.loadTextureCube( urls );
            reflection_Sharp.format = THREE.RGBFormat;

             // ENVIRONMENT REFLECTION MAP SOFT
            var path2 = "models/cubemap/Metal_Box_Refl/";
            var format2 = '.jpg';
            var urls2 = [
                    path2 + 'px' + format2, path2 + 'nx' + format2,
                    path2 + 'py' + format2, path2 + 'ny' + format2,
                    path2 + 'pz' + format2, path2 + 'nz' + format2
                ];
            var reflection_Metal_Box_Refl = THREE.ImageUtils.loadTextureCube( urls2 );
            reflection_Metal_Box_Refl.format = THREE.RGBFormat;

            // ENVIRONMENT REFLECTION MAP DEBUG
            var path_DEBUG = "models/cubemap/env_glass/"; //env_glass
            var format_DEBUG = '.jpg';
            var urls_DEBUG = [
                    path_DEBUG + 'px' + format_DEBUG, path_DEBUG + 'nx' + format_DEBUG,
                    path_DEBUG + 'py' + format_DEBUG, path_DEBUG + 'ny' + format_DEBUG,
                    path_DEBUG + 'pz' + format_DEBUG, path_DEBUG + 'nz' + format_DEBUG
                ];
            var reflection_DEBUG= THREE.ImageUtils.loadTextureCube( urls_DEBUG );
            reflection_DEBUG.format = THREE.RGBFormat;

            //Load Background animations


            //    backgrounds = [];


            ////////////////////////
            //  TEXTURES
            ////////////////////////
            var mapUrl = "models/obj/tex/diff_2k_8bit.png";
            var map = THREE.ImageUtils.loadTexture( mapUrl);
                map.anisotropy = 1;
                map.filters = THREE.LinearFilter;

            var mapScreenUrl = "models/obj/tex/screen_square.png";

            var screen_tex = new THREE.Texture(DrawMaterialView.getCanvas() );

            // screen_tex.magFilter = THREE.NearestFilter;  screen_tex.minFilter = THREE.NearestFilter;  screen_tex.generateMipmaps = false;
            //  var screen_tex = THREE.ImageUtils.loadTexture( mapScreenUrl);
                screen_tex.anisotropy = 8;
                screen_tex.filters = THREE.LinearFilter;
            //  screen_tex.generateMipmaps = true
                DrawMaterialView.setTexture( screen_tex )
            //  screen_tex.magFilter = THREE.LinearFilter;  //screen_tex.minFilter = THREE.NearestFilter;  screen_tex.generateMipmaps = false;
            //  screen_tex.minFilter = THREE.NearestFilter

            var mapNoise = THREE.ImageUtils.loadTexture('models/obj/tex/noise.png');
                mapNoise.anisotropy = 16;
                mapNoise.wrapS = THREE.RepeatWrapping;
                mapNoise.wrapT = THREE.RepeatWrapping;
                mapNoise.repeat.set(200, 50);

            var mapalpha = THREE.ImageUtils.loadTexture('models/obj/tex/logo_alpha.png');
                mapalpha.format = THREE.LuminanceFormat;
                mapalpha.anisotropy = 8;


            var usbMapUrl = "models/obj/tex/usb.png";
            var usbMap = THREE.ImageUtils.loadTexture( usbMapUrl);
                usbMap.anisotropy = 1;
                usbMap.filters = THREE.LinearFilter;

            var usbalpha = THREE.ImageUtils.loadTexture('models/obj/tex/usbAlpha.png');
                usbalpha.format = THREE.LuminanceFormat;
                usbalpha.anisotropy = 8;

            var usblightingMapUrl = "models/obj/tex/wirelessChargerLighting.png";
            var usbLightingMap = THREE.ImageUtils.loadTexture( usblightingMapUrl);
                usbLightingMap.anisotropy = 1;
                usbLightingMap.filters = THREE.LinearFilter;

            // var usbLightingAlpha = THREE.ImageUtils.loadTexture('models/obj/tex/lightAlpha.png');
            //     usbLightingAlpha.format = THREE.LuminanceFormat;
            //     usbLightingAlpha.anisotropy = 8;

            ////////////////////////
            //  MATERIALS
            ////////////////////////
            var screen_MAT = new THREE.MeshBasicMaterial({
                    map: screen_tex,
                    overdraw : true
                });

            var buttons_MAT = new THREE.MeshBasicMaterial({
                    ambient: 0x9cb8cf,
                    color: 0x9cb8cf,
                    transparent: true,
                    emission: 0x9cb8cf
                });

            var chrome_MAT = new THREE.MeshPhongMaterial( {
                    ambient: 0xb1b1b1,
                    color: 0xb1b1b1,
                    specular: 0x888888,
                    shininess: 20,
                    reflectivity: .6,
                    bumpMap: mapNoise,
                    bumpScale: 0.0003,
                    envMap: reflection_Metal_Box_Refl,
                    transparent: true,
                    metal: true
                })//specularMap: mapNoise,
            chrome_MAT.color.setHSL( 0, 0, .3 );

             var chrome_MATUSB = new THREE.MeshPhongMaterial( {
                    ambient: 0xb1b1b1,
                    color: 0xb1b1b1,
                    specular: 0x888888,
                    shininess: 20,
                    reflectivity: .6,
                    bumpMap: mapNoise,
                    bumpScale: 0.0003,
                    envMap: reflection_Metal_Box_Refl,
                    transparent: true,
                    metal: true
                })//specularMap: mapNoise,
            chrome_MATUSB.color.setHSL( 0, 0, .3 );

            var chromeTrim_MAT = new THREE.MeshLambertMaterial( {
                    // ambient: 0xb1b1b1,
                    // color: 0xe8e8e8,
                    // specular: 0x000000,
                    // shininess: 20,
                    // reflectivity: .7,
                    // envMap: reflection_Sharp,
                    // metal: true
                })//specularMap: mapNoise,
            chromeTrim_MAT.color.setHSL( 0, 0, .4 );

            // WORKING NICE LOOKING VERSIOn
            // var chromeTrim_MAT = new THREE.MeshPhongMaterial( {
            //         ambient: 0xb1b1b1,
            //         color: 0xe8e8e8,
            //         specular: 0xe8e8e8,
            //         shininess: 20,
            //         reflectivity: .7,
            //         // envMap: reflection_Sharp,
            //         metal: true
            //     })//specularMap: mapNoise,
            // chromeTrim_MAT.color.setHSL( 0, 0, .2 );

            var stripes_MAT = new THREE.MeshPhongMaterial( {
                    ambient: 0x6c6c6c,
                    color: 0x6c6c6c,
                    specular: 0x888888,
                    shininess: 1,
                    reflectivity: .4,
                    bumpMap: mapNoise,
                    bumpScale: 0.0002,
                    envMap: reflection_Metal_Box_Refl,
                    metal: true
                })//specularMap: mapNoise,
            stripes_MAT.color.setHSL( 0, 0, .4);

            var frontFace_MAT = new THREE.MeshPhongMaterial( {
                ambient: 0x323232,
                reflectivity: 1,
                shininess: 10   ,
                specular: 0x323232,
                map: map,
                envMap: reflection_Sharp

                  })
            // frontFace_MAT.color.setHSL( 0, 1, 1);

            var body_MAT = new THREE.MeshPhongMaterial( {
                ambient: 0x000721,
                reflectivity: 1,
                shininess: 1  ,
                specular: 0x5b5b5b,
                map: map,
                envMap: reflection_Sharp

                  })

            var chargerBody_MAT = new THREE.MeshPhongMaterial( {
                color: 0x000721,
                ambient: 0x000721,
                // reflectivity: .1,
                shininess: 90  ,
                specular: 0x0a0a0a,
                 transparent: true,
                // map: map,
                envMap: reflection_Sharp

                  })
                chargerBody_MAT.color.setHSL( .62, .6, .08);

            var chargerRubber_MAT = new THREE.MeshPhongMaterial( {
                color: 0x000721,
                ambient: 0x000721,
                transparent: true,
                // reflectivity: .1,
                shininess: 2  ,
                specular: 0x0a0a0a,
                // map: map,
                // envMap: reflection_Sharp

                  })
                chargerRubber_MAT.color.setHSL( .62, .3, .08);

            var lensGlass_MAT = new THREE.MeshPhongMaterial( {
                // ambient: 0xb1b1b1,
                // reflectivity: .1,
                shininess: 100,
                // specular: 0x686868,
                // color: 0xFFFFFF,
                opacity: .15,
                // blending: THREE.AdditiveBlending,
                transparent: true,
                envMap: reflection_DEBUG,
                depthWrite: true
                  })
            lensGlass_MAT.color.setHSL( 0, 0, .5);

            var wirelessChargerLogo_MAT = new THREE.MeshBasicMaterial({
                    ambient: 0x9cb8cf,
                    color: 0x9cb8cf,
                    transparent: true,
                    emission: 0x9cb8cf
                });

            var chargerLensGlass_MAT = new THREE.MeshPhongMaterial( {
                // ambient: 0xb1b1b1,
                reflectivity: 1,
                shininess: 90  ,
                specular: 0xbfbfbf,
                // color: 0xb1b1b1,
                opacity: 0.1,
                // blending: THREE.AdditiveBlending,
                transparent: true,
                envMap: reflection_Sharp,
                depthWrite: false
                  })

            var blackScreenUrl = "models/03_edge_notification.png";
            var blackScreenUrl_tex = THREE.ImageUtils.loadTexture( blackScreenUrl);
            var screenPink_MAT = new THREE.MeshBasicMaterial({
                    color: 0xe92b79
                });

            var screenMideBlack_MAT = new THREE.MeshBasicMaterial({
                    color: 0x000000

                    //map: blackScreenUrl_tex
                });

            var shadeLogo_MAT= new THREE.MeshBasicMaterial({
                color: 0x80919e,
                alphaMap: mapalpha,
                transparent: true,
                depthWrite: true
                });


            var usbCharger_MAT = new THREE.MeshLambertMaterial( {
                // color: 0x000721,
                // ambient: 0x000721,
                // reflectivity: .1,
                shininess: 0  ,
                specular: 0x0a0a0a,
                map: usbMap,
                alphaMap: usbalpha,
                transparent: true,
                depthWrite: true
                // envMap: reflection_Sharp
                });
            usbCharger_MAT.color.setHSL( 0, 0, .4);

            var LightingCharger_MAT = new THREE.MeshBasicMaterial( {
                map: usbLightingMap,
                // overdraw : true
                transparent: true,
                depthWrite: true
                });
                // usbLightingMap
             LightingCharger_MAT.color.setHSL( 0, 0, .7);


            var chargerCable_MAT = new THREE.MeshLambertMaterial( {
                alphaMap: usbalpha,
                depthWrite: true,
                color: 0x00030c,
                ambient: 0x000721,
                shininess: 90  ,
                specular: 0x0a0a0a,
                transparent: true,
                envMap: reflection_Sharp
                });
                // chargerCable_MAT.color.setHSL( .62, .6, .08);

            // create custom material from the shader code above
            //   that is within specially labeled script tags

            ////////////////////////
            //  GEOMETRY
            ////////////////////////
            //-
            //      OBJ      //
            ////////////////////////


            var loader = new THREE.OBJMTLLoader();

                loader.load('models/obj/edge6.obj', 'models/obj/edge6.mtl', function(object) {
                     trace( "DONE loading model1")
                phoneModel = object;

                frontFace = phoneModel.children[2];
                frontFace.material = frontFace_MAT;

               // frontFace.geometry.computeVertexNormals();

                //   frontFace.geometry.computeVertexNormals();

                glass = phoneModel.children[5];
                glass.material = lensGlass_MAT;
                // glass.visible = false;

                screenFace = phoneModel.children[8];
                screenFace.material = screen_MAT;//screenMideBlack_MAT;//screen_MAT;//
                // screenFace.visible = false;
                //screenFace.geometry.computeVertexNormals();

                body = phoneModel.children[11];
                body.material = body_MAT;

                //body.geometry.computeVertexNormals();

                chrome = phoneModel.children[14];
                chrome.material = chrome_MAT;

                stripes = phoneModel.children[17];
                stripes.material = stripes_MAT;

                buttons = phoneModel.children[20];
                buttons.material = buttons_MAT;

                // chromeTrim = phoneModel.children[23];
                // chromeTrim.material = chromeTrim_MAT;
                // chromeTrim.visible = false;

                // screenPink = phoneModel.children[26];
                // screenPink.material = screenPink_MAT;

                // screenMideBlack = phoneModel.children[29];
                // screenMideBlack.material = screenMideBlack_MAT;

                logo = phoneModel.children[23];//32]
                logo.material = shadeLogo_MAT;


                // SHADOWS
                // body.receiveShadow = true;
                body.castShadow = true;
                // chrome.receiveShadow = true;
                chrome.castShadow = true;
                // screenFace.receiveShadow = true;
                screenFace.castShadow = true;
                // glass.receiveShadow = true;
                glass.castShadow = true;
                // logo.receiveShadow = true;
                logo.castShadow = true;

                ////////////////////////
                //  HIDING PINK GEO WITH BLACK CENTER
                // screenPink.visible = false;
                // screenMideBlack.visible = false;


                // MOON GLOW SHADER
                

                // GROUPING
                group = new THREE.Object3D();

               

                targetPhoneObject = new THREE.Object3D();

                $('.progress').html('90');

                // GROUPING AND PARENTING
                scene.add( masterObject);
                group.add(targetPhoneObject);

                targetPhoneObject.add(phoneModel);

                masterObject.add(group);
                targetObject = group;

                // XFORMS
                masterObject.position.z = 0;
                targetObject.rotation.x = 89 * (Math.PI / 180);
                targetObject.scale.x = targetObject.scale.y = targetObject.scale.z = 1.25;

                //RENDER PROPERTIES
                phoneModel.renderDepth = .8;

              //  phoneModel.computeVertexNormals();
                // ANIMATION
               TweenLite.delayedCall( .5 , DrawMaterialView.renderOn )
                 DrawMaterialView.renderOn()
                  trace( "loading model2")
                 // WIRELESS CHARGER
                 loaderCharger = new THREE.OBJMTLLoader();

                    loaderCharger.load('models/obj/edge6_charger.obj', 'models/obj/edge6_charger.mtl', function(chargerObject) {
                            trace( "Done loading model2")
                        chargerModel = chargerObject;

                        chargerSamsungLogo = chargerModel.children[2];
                        chargerSamsungLogo.material = wirelessChargerLogo_MAT;

                        chargerCenterRubber = chargerModel.children[5];
                        chargerCenterRubber.material = chargerRubber_MAT;

                        chargerGlass = chargerModel.children[8];
                        chargerGlass.material = chargerLensGlass_MAT;//chargerLensGlass_MAT;

                        chargerBottom = chargerModel.children[11];
                        chargerBottom.material = chargerBody_MAT;

                        chargerLighting = chargerModel.children[14];//14
                        chargerLighting.material = LightingCharger_MAT;

                        chargerCable = chargerModel.children[17];//14
                        chargerCable.material = chargerCable_MAT;

                        // SHADOWS
                        chargerSamsungLogo.receiveShadow = true;
                        chargerCenterRubber.receiveShadow = true;
                        chargerGlass.receiveShadow = true;
                        chargerBottom.receiveShadow = true;

                        // WIRELESS MATERIAL OPACITY
                        wirelessChargerLogo_MAT.opacity = 0;
                        chargerRubber_MAT.opacity = 0;
                        chargerLensGlass_MAT.opacity = 0;
                        chargerBody_MAT.opacity = 0;
                        LightingCharger_MAT.opacity = 0;

                        // WIRELESS XFORM
                        chargerModel.rotation.x = 89 * (Math.PI / 180);
                        chargerModel.rotation.y = .6;
                        // chargerModel.position.y = -3;// 3.41
                        chargerModel.position.z = -2;// 3.41
                        chargerModel.scale.x = chargerModel.scale.y = chargerModel.scale.z = 1.15;

                        // PARENTING
                        phoneModel.add(chargerModel);

                        //WIRELESS DEBUGGING
                        // chargerModel.renderDepth = .3;
                        // chargerModel.position.z = -5
                        // chargerGlass = false;
                        // chargerModel.visible = false;


                        // ChargerModelView.js
                        ChargerModelView.init( wirelessChargerLogo_MAT, chargerRubber_MAT , chargerLensGlass_MAT , chargerBody_MAT , LightingCharger_MAT, chargerModel  )


                        // LOAD USB CHARGER
                        var usbCharger = new THREE.OBJMTLLoader();
                        usbCharger.load('models/obj/usb.obj', 'models/obj/usb.mtl', function(usbChargerObject) {

                            usbChargerModel = usbChargerObject;
                            usbChargerBody= usbChargerModel.children[2];
                            usbChargerBody.material = usbCharger_MAT;

                            usbChargerModel.renderDepth = .8;
                            //usbChargerModel.visible = false
                            usbChargerModel.visible = false;

                            phoneModel.add(usbChargerModel);

                            //USBModelView.js
                            USBModelView.init( usbCharger_MAT , chrome_MATUSB , usbChargerModel  )
                            // LoaderWrapper.speedDatLoaderUp();
                            loading = false;
                            DrawMaterialView.renderOn()
                            TweenLite.delayedCall( .5 , DrawMaterialView.renderOn )
                            removeLoader();
                             onWindowResize()

                        });

                });

            });
            // END OBJ ////////////////////////

// samsung
// s@msung!@
//////////////////////////////////////////////////////////////////////
////////////////    RENDERING AND POST EFFECTS   /////////////////////
//////////////////////////////////////////////////////////////////////

            if (Detector.webgl) {
                renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    precision: "highp",
                    alpha: true,
                    clearAlpha: 0

                });
                renderer.autoClear = false;
               // renderer.shadowMapEnabled = true;
                // renderer.shadowMapType = THREE.PCFSoftShadowMap;
                renderer.sortObjects = false;
                renderer.setSize(container.width(), container.height());
                renderer.setClearColor( 0x000000, 0 )
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.alpha = true;

                css3renderer = new THREE.CSS3DRenderer();
                css3renderer.setSize( window.innerWidth, window.innerHeight );
                css3renderer.domElement.style.position = 'absolute';
                css3renderer.domElement.style.top = 0;

                container.append(css3renderer.domElement);


                //,precision: "highp"
                //renderer.gammaInput = true;
                //renderer.gammaOutput = true;
                //renderer.autoClear = false;

                //NOTE!!
                //USING THE COMPOSER TURNS OFF NATIVE ANTIALIASING
                //DO NOT USE PLEASE. :)
                //console.log("==========================================================");

                // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                // var cube = new THREE.Mesh( geometry, material );
                // scene.add( cube );
                /*

                var width = window.innerWidth || 1;
                var height = window.innerHeight || 1;
                var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };

                var renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

                // cmp = new THREE.EffectComposer(r, renderTarget);


                // // renderScene = new THREE.RenderPass(scene, camera);
                var renderModel = new THREE.RenderPass( scene, camera );
                var effectFXAA = new THREE.ShaderPass( THREE.ShaderExtras[ "fxaa" ] );
                var effectScreen = new THREE.ShaderPass( THREE.ShaderExtras[ "blend" ] );
                // effectFXAA.uniforms[ 'resolution' ].value.set( 2 / container.width(), 2 / container.height() );
                effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

                composer = new THREE.EffectComposer( renderer , renderTarget);
                composer.addPass( new THREE.RenderPass( scene, camera ) );
                // effectFXAA.renderToScreen = true;
                effectScreen.renderToScreen = true;

                // composer = new THREE.EffectComposer( renderer );
                // composer.addPass( renderModel );
                composer.addPass( effectFXAA );
                composer.addPass( effectScreen );

                */
                //console.log("==========================================================");

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


                var videoObject0 = document.getElementById("js-backGroundVideo0" );
                var videoObject = document.getElementById("js-backGroundVideo1" );
                var videoObject2 = document.getElementById("js-backGroundVideo2" );
                var videoObject5 = document.getElementById("js-backGroundVideo5" );
                var videoObject3 = document.getElementById("js-backGroundVideo4" );
                var videoObject4 = document.getElementById("js-backGroundVideo3" );


                //////////////////
                ///   CSS 3D   ///
                //////////////////
                 var object0 = new THREE.CSS3DObject( videoObject0 );

                object0.rotation.x =0;

                object0.position.x =0
                object0.position.y =0
                object0.position.z = 0
               // object.rotation.x = 0
                object0.rotation.y = 0
                object0.rotation.z = 0
                object0.scale.x = 1
                object0.scale.y = 1

                sceneCSS.add( object0 );


                var object = new THREE.CSS3DObject( videoObject );

                object.rotation.x =0;

                object.position.x =0
                object.position.y =0
                object.position.z = 0
               // object.rotation.x = 0
                object.rotation.y = 0
                object.rotation.z = 0
                object.scale.x = 1
                object.scale.y = 1

                sceneCSS.add( object );

                 var object2 = new THREE.CSS3DObject( videoObject2 );

                object2.rotation.x =0;

                object2.position.x =0
                object2.position.y = -100 //100
                object2.position.z = -150
               // object.rotation.x = 0
                object2.rotation.y = 0
                object2.rotation.z = 0
                object2.scale.x = 1
                object2.scale.y = 1

                sceneCSS.add( object2 );


                var object5 = new THREE.CSS3DObject( videoObject5 );

                object5.rotation.x =0;

                object5.position.x =0
                object5.position.y = 42
                object5.position.z = 0
               // object.rotation.x = 0
                object5.rotation.y = 0
                object5.rotation.z = 0
                object5.scale.x = 1
                object5.scale.y = 1

                sceneCSS.add( object5 );

                 var object3 = new THREE.CSS3DObject( videoObject3 );

                object3.rotation.x =0;

                object3.position.x =0
                object3.position.y = 12
                object3.position.z = 0
               // object.rotation.x = 0
                object3.rotation.y = 0
                object3.rotation.z = 0
                object3.scale.x = 1
                object3.scale.y = 1

                sceneCSS.add( object3 );

                 var object4 = new THREE.CSS3DObject( videoObject4 );

                 object4.rotation.x =0;

                object4.position.x =0
                object4.position.y = -40
                object4.position.z = 0
               // object.rotation.x = 0
                object4.rotation.y = 0
                object4.rotation.z = 0
                object4.scale.x = 1
                object4.scale.y = 1

                sceneCSS.add( object4 );

            } else {  //not Detector.webgl
                renderer = new THREE.CanvasRenderer();
                renderer.setSize(container.width(), container.height());
                renderer.setClearColorHex(0x000000, 1);
            }

            container.append(renderer.domElement);


        }


        var mouseDown = ""
        var wrapper = document.getElementById( "wrapper")

        var isDragging = false;
        var previousMousePosition = {
            x: 1,
            y: 1
        };

        var previousMousePositionM = {
            x: 1,
            y: 1
        };

        var three = THREE;


        function addMouseEvents() {
            //trace( "addMouseEvents")
            contentPointer.addEventListener( 'mousedown', onDocumentMouseDown, false );
        }

        function removeMouseEvents() {
           contentPointer.removeEventListener( 'mousedown', onDocumentMouseDown, false );
        }

    function onDocumentMouseDown(event)
    {
        if( mouse == true  ){

            contentPointer.classList.remove( "customDragOver" );
             contentPointer.classList.add( "customDragDOWN" );

             isDragging = true;
             if( hasMouseMoveListener == false )
             {
                 document.addEventListener('mousemove', onDocumentMouseMove, false);
                contentPointer.addEventListener('mouseup', onDocumentMouseUp, false);
                 hasMouseMoveListener = true;
             }

        }


    }


    var isPinkOpen = false;
    function showPink() {
         ////////////////////////
         /*
                if( isPinkOpen == false )
                {
                    isPinkOpen = true;
                    //  HIDING PINK GEO WITH BLACK CENTER
                   screenPink.material.transparent = true
                   screenMideBlack.material.transparent = true
                    TweenLite.set ( screenPink.material , { opacity:0} )
                    TweenLite.set ( screenMideBlack.material , { opacity:0} )
                    screenPink.visible = true;
                    screenMideBlack.visible = true;
                    //trace( screenPink.material + ' screenPink.material' )
                    TweenLite.to ( screenPink.material , .4 , { opacity:1 , overwrite: true,delay:0 } )
                    TweenLite.to ( screenMideBlack.material , .4 , { opacity:1 , overwrite: true,delay:0 } )
                    // WILL HAVE TO DO A VISIBILITY SWAP WITH:
                  //  screenFace.visible = false;
                }

                */

    }
     function hidePink() {
         ////////////////////////
          /*
           if( isPinkOpen == true)
            {
                    isPinkOpen = false;
               TweenLite.to ( screenPink.material , .4 , { opacity:0 , overwrite: true, delay:0 } )
               TweenLite.to ( screenMideBlack.material , .4 , { opacity:0 , overwrite: true, delay:0 } )

           }

           */
    }




    function onDocumentMouseMove(e)
    {

        if( mouse == true  ){


            var x = e.offsetX || e.layerX;
            var y = e.offsetY || e.layerY;

            var deltaMove = {
                x: x-previousMousePosition.x,
                y: y-previousMousePosition.y
            };


          //  //trace( x + " deltaMove x")

            if(isDragging) {

                var deltaRotationQuaternion = new three.Quaternion()
                    .setFromEuler(new three.Euler(
                        toRadians(deltaMove.y * .05),
                        toRadians(deltaMove.x * .05),
                        0,
                        'XYZ'
                    ));




                slerpMouse = {
                                percentage: 0
                            };

                          //  var sleprQuaternion = new THREE.Quaternion();

                          //  sleprQuaternion = new THREE.Quaternion().copy(phoneModel.quaternion)

                            TweenMax.to(slerpMouse, .5, {
                                percentage: 1, ease:Circ.easeOut  ,
                                onUpdate: function() {

                                  //  //trace( 'updatees tweens')
                                    phoneModel.quaternion.multiplyQuaternions(deltaRotationQuaternion, phoneModel.quaternion);
                                }
                            });


                        //   //trace( phoneModel.rotation.x + "   " + phoneModel.rotation.y + "   " + phoneModel.rotation.z)
                  // moveAndLookAt( camera, deltaRotationQuaternion , {duration: 300})
              //phoneModel.quaternion.multiplyQuaternions(deltaRotationQuaternion, phoneModel.quaternion);

              checkRangeM();
            }



            testShowFeatures();
            previousMousePosition = {
                x: x,
                y: y
            };

        }

        ////trace( e.offsetX  + "e.offsetX")
    }

    function toRadians(angle) {
      return angle * (Math.PI / 180);
    }

    function toDegrees(angle) {
        return angle * (180 / Math.PI);
    }

    function onDocumentMouseUp(event)
    {
        if( mouse == true  ){
            //trace( "  onDocumentMouseUp ")
            isDragging = false;



            contentPointer.classList.add( "customDragOver" );
             contentPointer.classList.remove( "customDragDOWN" );
            ////trace( "mouseups" + currentRotationCorrds.x + " currentRotationCorrds" + currentRotationCorrds.y + " " + currentRotationCorrds.z)
              //trace( currentRotationCorrds.x + " currentRotationCorrds.x")
            if( currentRotationCorrds.x != undefined ) {
               // currentRotationCorrds.z = Math.random()*1
               // currentRotationCorrds.x = Math.random()*1
               // currentRotationCorrds.y = Math.random()*1;
               //trace( "lets move into place")


               TweenMax.killTweensOf(slerpMaster);
                TweenMax.to(phoneModel.rotation, 1.5, {           
                                z: currentRotationCorrds.z,
                                x: (currentRotationCorrds.x),
                                y: (currentRotationCorrds.y),
                                overwrite: true,
                                ease: Power3.easeInOut  ,
                                onComplete: popDatDotAlpha
                            });

            }

        }




    }

    function popDatDotAlpha(id ) {
        //var internalId = FeaturesData[id].id
        DotMenuView.setFullOpacity(  currentId )
    }

    function checkForCharger( id ) {
        if( id == 4 ) {
           ChargerModelView.openView();
       }else{

            ChargerModelView.closeView();
       }
    }

    function checkForUSBCharger( id ) {
        if( id == 3 ) {
           USBModelView.openView();
       }else{

            USBModelView.closeView();
       }
    }

    function shuttleToPosition( id ) {

        FeaturesController.showFeatureById(id);

        if( id == 3 ) {
          TweenLite.to( disclaimer , .5 , { opacity:1 })
        }else{
          TweenLite.to( disclaimer , .5 , { opacity:0 })
        }

        if( id == 0 ) {
          TweenLite.to( whaleLegal , .5 , { opacity:1 })
        }else{
          TweenLite.to( whaleLegal , .5 , { opacity:0 })
        }

         

        if( id != 3 ) {

            USBModelView.closeView();

        }

        if( id != 4 ) {
            ChargerModelView.closeView();
        }
      // hidePink()
         DrawMaterialView.closeView()
        var currentRotationCorrds = FeaturesData[id].mouseUpShuttle.position
        TweenMax.killTweensOf(slerpMaster);
            TweenMax.to(phoneModel.rotation, 1.5, {           
                            z: currentRotationCorrds.z,
                            x: (currentRotationCorrds.x),
                            y: (currentRotationCorrds.y),
                            overwrite: true,
                            ease: Power3.easeInOut  ,
                            onComplete: setCurrentRotCords,
                            onCompleteParams: [ id ]      
                        });

    }

    function setCurrentRotCords( id) {

        currentRotationCorrds.z = FeaturesData[id].mouseUpShuttle.position.z;
        currentRotationCorrds.x = FeaturesData[id].mouseUpShuttle.position.x;
        currentRotationCorrds.y = FeaturesData[id].mouseUpShuttle.position.y;

         if( id == 2 ) {
           showPink()
       }else{
            hidePink()
       }
        checkForCharger( id )
        checkForUSBCharger( id )
        var internalId = FeaturesData[id].id
        var screenId = FeaturesData[id].screenId

        DotMenuView.setFullOpacity( internalId )
         DrawMaterialView.openById( internalId , screenId )
         currentId  = id;

        //currentRotationCorrds = cords;
        //trace( "set current cords")
    }







        /**
        @function bindEvents
        Bind events to elements on home page
        **/
        function bindEvents() {
            $(window).resize(function() {
                onWindowResize();
            });

            $('.close-cv').on("click", function() {
                $('.intro').fadeIn();
            });
        }

        /**
        @function animate
        **/
        function animate() {
            requestAnimationFrame(animate);
            render();
            //updateSpecs();





        }



        function hideIntroScreen() {

                        //On First connect
                        if (!loading){
                            isIntoOpen = false
                            SuccessView.openViewDevice();

                        }
                        else {
                            $('.loader').fadeIn(600);

                        }

                      // BackGroundLightView.openView()
        }

         function showIntroScreen() {
                      //  var detection = $('.detection');
                         $('.intro').fadeIn();
                        isIntoOpen = true
                        //trace( "showIntroScreen")
        }

        function hideIntroScreenMouse() {

                        //On First connect
                        if (!loading){
                           SuccessView.openViewMouse()
                           isIntoOpen = false
                        }
                        else {
                            $('.loader').fadeIn(600);

                        }

                     // BackGroundLightView.openView()
        }

        function reloadFeatures() {

        }

        function FeatureView(feature, target, imagePath) {

        }

        /**
        @function render
        **/
        function render() {
            camera.lookAt(scene.position);
            renderer.render(scene, camera);

            // renderer.clear();
            // composer.render();
            css3renderer.render( sceneCSS, cameracss3);


        }

        function rotateAroundTargetOnXAxis(obj, target, angle, radius) {
            obj.position.x = 0;
            obj.position.y = Math.sin(angle) * radius;
            obj.position.z = Math.cos(angle) * radius;
        }

        function rotateAroundTargetOnZAxis(obj, target, angle, radius) {
            obj.position.z = 0;
            obj.position.y = Math.sin(angle) * radius;
            obj.position.x = Math.cos(angle) * radius;
        }

        /**
        @function onWindowResize
        updates render on resize
        **/
        function onWindowResize() {
            containerHeight();
            windowHalfX = $('.canvas-container').width() / 2;
            windowHalfY = $('.canvas-container').height() / 2;

           // //trace( "resize " + window.innerWidth)
            camera.aspect = $('.canvas-container').width() / $('.canvas-container').height();

            //trace( camera.aspect + "__________-camera.aspect")
            camera.updateProjectionMatrix();

          //  //trace( scene.position)

            renderer.setSize($('.canvas-container').width(), $('.canvas-container').height());

            css3renderer.setSize( $('.canvas-container').width(), $('.canvas-container').height() );
            if( window.innerHeight > 650 ){
               document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }

            if( loading == false ){

                if( window.innerHeight > 850 ){
                    setScale( 1 )
                }else{
                    setScale( .8 )
                }
            }
            // effectFXAA.uniforms['resolution'].value.set(1 / (window.innerWidth * dpr), 1 / (window.innerHeight * dpr));
           // composer.setSize($('.canvas-container').width(), $('.canvas-container').height());
        }

        /**
        @function onWindowResize
        mouse move events

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) / 2;
            mouseY = (event.clientY - windowHalfY) / 2;
        }

        /**
        @function guidCall
        Service call for UID injects value
        **/
        function guidCall(f) {
            var paramUID=getUrlParameter('uid');
            if (paramUID){
  /*
                $.ajax({
                  type: 'GET',
                  url: server + '/miniguid?uid='+paramUID,
                  crossDomain: true,
                  headers: {
                      'MyCustomHeader': 'important information'
                  },
                  xhrFields: {
                      withCredentials: true
                  },
                  username: 'samsung',
                  password: 's@msung!@',
                  success: function(data) {
                      uid = data.miniGUID;
                        $('#uid-container').append(data.miniGUID);
                        f();
                      //console.log('success');
                  },
                  error: function() {
                      //console.log('failure');
                  }
                });
               */
                $.get(server + '/miniguid?uid='+paramUID, function(data) {
                    //                var uidObj = jQuery.parseJSON(data);
                    uid = data.miniGUID;
                    $('#uid-container').append(data.miniGUID);
                    f();
                }).fail(function() {
                    //trace( " guidCall failure")
                        //TODO: error state TBD
                });



            } else {
                 /*
                 $.ajax({
                  type: 'GET',
                  url: server + "/miniguid",
                  crossDomain: true,

                  headers: {
                      'MyCustomHeader': 'important information'
                  },
                  xhrFields: {
                      withCredentials: true
                  },
                  username: 'samsung',
                  password: 's@msung!@',
                  success: function( data ) {
                     uid = data.miniGUID;
                    //console.log("setting uid", uid);
                    $('#uid-container').append(data.miniGUID);
                    f();
                  },
                  error: function() {
                      //console.log('failure');
                  }
                });
 */

                $.get(server + "/miniguid", function(data) {
                    //                var uidObj = jQuery.parseJSON(data);
                    uid = data.miniGUID;
                    //console.log("setting uid", uid);
                    $('#uid-container').append(data.miniGUID);
                    f();
                }).fail(function() {
                    //trace( " guidCall failure")
                        //TODO: error state TBD
                });

            }


        }

        function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                    return sParameterName[1];
                }
            }
        }

        /**
        @function deviceDectect
        Dectects useragent for desktop experience
        **/
        function deviceDectect() {

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            } else {
                return false;
            }
        }

        /**
        @function supportedBrowser
        Dectects useragent for supported browsers
            Unsupported browsers: IE10 and below
        **/
        function supportedBrowser() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            var trident = ua.indexOf('Trident/');

            if (msie > -1) {
                // IE 10 or older
                return false;
            } else if (trident > -1) {
                // IE 11 (or newer)
                return true;
            } else {
                return true;
            }
        }

        /**
        @function altContent
        Serves alt content if WebGL or Device
        **/
        function altContent() {
            //TODO: ALT content to be displayed

            //placeholder for now
            $('.content').addClass('error-msg');
              $('.intro').css('display', 'none');
              $('.alt-content').css('display', 'block');

              initAfterDetects()

              var spec= document.getElementById( "specs-container" );
              spec.style.display = "none";

              var cans = document.getElementById( "exCavasHooks" )
              cans.style.display = "none";

              var auddioBtn = document.getElementById( "js-muteBtn" );
              auddioBtn.style.display = "none";

            //  alert( "who thats one old delorean...");
        }

        function safariInstructions() {
            //TODO: ALT content to be displayed

            //placeholder for now
            $('.content').addClass('safari-msg');
            // $('.alt-content').css('display', 'block');
        }


        /**
        @function containerHeight
        sets height of container to window height - nav elements
        **/
        function containerHeight() {
            var docHeight = $(window).height();// - $('.gnb-header').height() - $('.breadcrumbs').height();
            $('#content-container').height(docHeight);

            excontrollerSwitcher.style.top = window.innerHeight - 70 + "px";
            var auddioBtn = document.getElementById( "js-muteBtn" );
            auddioBtn.style.top = window.innerHeight - 50 + "px";
            excontrollerSwitcherTextLabels.style.top = window.innerHeight - 50 + "px";


            if( window.innerWidth > 1175 ){
                var amount = 26;
                excontrollerSwitcher.style.left =  21 - amount +  "px"
                excontrollerSwitcherTextLabels.style.left =  75 - amount + "px"
            }else{
                excontrollerSwitcher.style.left =  21 +  "px"
                excontrollerSwitcherTextLabels.style.left =  75 +  "px"
            }


            var footer = document.getElementById( "js-footer")
           // footer.style.top = window.innerHeight - 52 + "px";
        }

        /***
        @function sign
        return a number sign
        **/
        function sign(n) {
            return n == 0 ? 0 : n / Math.abs(n);
        }

        /**
        @function introBG
        Rotates intro bg
        **/
        function introBG() {

            var $introBgOne = $('.bg1'),
                $introBgTwo = $('.bg2');

            $introBgOne.hide();
            $introBgTwo.fadeIn(500);

            setInterval(function() {
                $introBgTwo.fadeOut(2000).fadeIn(2000);
                $introBgOne.fadeIn(2000).fadeOut(2000);
            }, 4000);
        }


        function getCurrentId() {
            return currentId
        }


        init();

        exPublicApi.getCurrentId = getCurrentId;
        exPublicApi.hideMouseSwitcher = hideMouseSwitcher;
        exPublicApi.showMouseSwitcher = showMouseSwitcher;

        exPublicApi.loadingPercentageComplete = loadingPercentageComplete;


    };



}(jQuery));



$(function() {
    new ssHQ.main();
});

////trace( ssHQ.main.introBG + " ref poointer to ssHQ")

$.fn.redraw = function(){
  $(this).each(function(){
    $(this).addClass('hidden');
    $(this).removeClass('hidden');
  });
};
/* END FILE */
/* END FILE */
(function (a, b, c, d) {

  a = '//tags.tiqcdn.com/utag/samsung/main/prod/utag.js';
  var hostName = location.hostname;

  if (hostName.indexOf('devus') != -1 || hostName.indexOf('devwww') != -1 || hostName.indexOf('dev') != -1 || hostName.indexOf('stgwww') != -1 || hostName.indexOf('stgapp') != -1 || hostName.indexOf('prod') != -1 || hostName.indexOf('local') != -1) {
    a = '//tags.tiqcdn.com/utag/samsung/main/dev/utag.js';
  } else if (hostName.indexOf('stgweb') != -1) {
    a = '//tags.tiqcdn.com/utag/samsung/main/qa/utag.js';
  }

  b = document;
  c = 'script';
  d = b.createElement(c);
  d.src = a;
  d.type = 'text/java' + c;
  d.async = true;
  a = b.getElementsByTagName(c)[0];
  a.parentNode.insertBefore(d, a);
  analytics = { device: null, retailer : null };

  var utag_data = {
    page_type : "b2c|showcase",
    page_channel : "product"
    };

  $(window).load(function(){
    //your code here

    $(document).on('click', function(event){
      var dataGroup;
      var dataValue;
      var tagParams;
      
      console.log( "analytics:\n  -  target id: " + $( event.target ).attr('id') );

      if( $( event.target ).hasClass('analytics-target') ) {
      	dataGroup = $( event.target ).attr('data-group');
      	dataValue = $( event.target ).attr('data-value');
      	console.log('  -  dataGroup: '+dataGroup);
      	console.log('  -  dataValue: '+dataValue);

      	switch(dataGroup) {
      		case "connect": //3.1
      			tagParams = { eVar11:document.location+">with your phone>explore", link_id:"explore_with_your_phone", link_meta:"link_name:explore with your phone", link_position:"modal", link_cat:"explore with your phone" };
      			break;
      		case "use-my-mouse": //3.2
      			tagParams = { eVar11:document.location+">with your mouse>explore", link_id:"explore_with_your_mouse", link_meta:"link_name:explore with your mouse", link_position:"modal", link_cat:"explore with your mouse" };
      			break;
      		case "shop-now": //3.3
      			tagParams = { eVar11:document.location+">header>shop now", link_id:"header_shop_now", link_meta:"link_name:shop now", link_position:"header", link_cat:"shop now" };
      			break;
      		case "learn-more": //3.4
      			tagParams = { eVar11:document.location+">header>learn more", link_id:"header_learn_more", link_meta:"link_name:learn more", link_position:"header", link_cat:"learn more" };
      			break;
      		case "share": //3.5
      			tagParams = { eVar11:document.location+">header>share", link_id:"header_share", link_meta:"link_name:share", link_position:"header", link_cat:"share" };
      			break;
      		case "facebook": //3.6
      			tagParams = { eVar11:document.location+">modal>social media share", link_id:"modal_facebook_share", link_meta:"link_name:link_name:social media share|social_click_type:facebook", link_position:"modal", link_cat:"social share", social_click_type:"facebook" };
      			break;
      		case "twitter": //3.7
      			tagParams = { eVar11:document.location+">modal>social media share", link_id:"modal_twitter_share", link_meta:"link_name:social media share|social_click_type:twitter", link_position:"modal", link_cat:"social share", social_click_type:"Twitter" };
      			break;
      		case "retailer": //3.8
      			analytics.retailer = dataValue;
      			tagParams = { eVar11:document.location+">"+dataValue+">select carrier or retailer", link_id:"select_carrier_"+dataValue, link_meta:"link_name:select carrier or retailer", link_position:dataValue, link_cat:"select carrier or retailer" };
      			break;
      		case "device": //3.9
      			analytics.device = dataValue;
      			tagParams = { eVar11:document.location+">"+dataValue+">select device", link_id:"select_device_"+dataValue, link_meta:"link_name:select device", link_position:dataValue, link_cat:"select device" };
      			break;
      		case "lets-go": //3.10
      			tagParams = { eVar11:document.location+">"+analytics.device+">"+analytics.retailer+">lets-go", link_id:"lets_go_"+analytics.device+"_"+analytics.retailer, link_meta:"link_name:lets-go", link_position:analytics.device+">"+analytics.retailer, link_cat:"lets-go" };
      			break;
      		case "email": //3.11
      			tagParams = { eVar11:document.location+">modal>social media share", link_id:"modal_email_share", link_meta:"link_name:social media share|social_click_type:email", link_position:"modal", link_cat:"social share", social_click_type:"email" };
      			break;
      		case "explore-with-mouse": //3.12a
      			tagParams = { eVar11:document.location+">header>explore with your mouse", link_id:"header_use_your_mouse", link_meta:"link_name:explore with your mouse", link_position:"header", link_cat:"explore with your mouse" };
      			break;
      		case "explore-with-phone": //3.12b
      			tagParams = { eVar11:document.location+">header>explore with your phone", link_id:"explore_with_your_phone", link_meta:"link_name:explore with your phone", link_position:"header", link_cat:"explore with your phone" };
      			break;
      		case "sync-success": //3.13
      			tagParams = { eVar11:document.location+">page>mobile sync success", link_id:"mobile_sync_success", link_meta:"link_name:mobile sync success", link_position:"page", link_cat:"mobile sync success" };
      			break;
      			
      		case "mobile-buy-now": //
      			tagParams = { eVar11:document.location+">mobile_footer>buy now", link_id:"mobile_footer_shop_now", link_meta:"link_name:buy now", link_position:"mobile_footer", link_cat:"buy now" };
      			break;
      		case "mobile-learn-more": //
      			tagParams = { eVar11:document.location+">mobile_footer>learn more", link_id:"mobile_footer_learn_more", link_meta:"link_name:learn more", link_position:"mobile_footer", link_cat:"learn more" };
      			break;
      	}
      	console.log("  -  tagParams:",tagParams);
      	if(s) s.tl(tagParams);
      	if(utag) utag.link(tagParams);
      	
			}
    });
  });
})();
