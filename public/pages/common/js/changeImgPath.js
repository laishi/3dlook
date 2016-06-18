// CHANGE IMG PATH    
var pageCont = document.querySelector(".pageCont");

var getImgPath = pageCont.getElementsByTagName("img");

for (var i = 0; i < getImgPath.length; i++) {

    var imgURL     = getImgPath[i].src;
    var urlSplit   = imgURL.split("/");
    var urlLenght  = urlSplit.length;
    var curUrlName = urlSplit[urlLenght-1];
    
    console.log(curUrlName);

    var pathBase = "../../img/workimg/";
    getImgPath[i].src = pathBase + curUrlName;
}
