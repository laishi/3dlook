
var shareBtn =

"<ul class=' shares bdsharebuttonbox' data-tag='share_1'>" +
    "<li class='shareBtn'> <a class='shareLink bds_weixin fa fa-weixin' data-cmd='weixin'> </a> </li>" +
    "<li class='shareBtn'> <a class='shareLink bds_qzone fa fa-qq' data-cmd='qzone'> </a> </li>" +
    "<li class='shareBtn'> <a class='shareLink bds_tsina fa fa-weibo' data-cmd='tsina'> </a> </li>" +
    "<li class='shareBtn'> <a class='shareLink bds_bdysc fa fa-heart' data-cmd='bdysc'> </a> </li>" +
    "<li class='shareBtn'> <a class='shareLink bds_baidu fa fa-plus' data-cmd='mshare'> </a> </li>" +
"</ul>"




$(".pageTitle").append(shareBtn)

var shareTitle = $("title").text();

var shareSummary = $(".summary").text();

var url = $(location).attr('href');

window._bd_share_config = {
    common : {
        bdText : shareTitle, 
        bdDesc : shareSummary, 
        bdUrl : url,   
        bdPic : '../img/3dlogo.png'
    },
    share : [{
        "tag" : "share_1",
        "bdSize" : 32
    }],
    // slide : [{     
    //     bdImg : 0,
    //     bdPos : "right",
    //     bdTop : 100
    // }],
    image : [{
        viewType : 'collection',
        viewPos : 'top',
        viewColor : 'black',
        viewSize : '16',
        viewList : ['qzone','tsina','huaban','tqq','renren']
    }],
    selectShare : [{
        "bdselectMiniList" : ['qzone','tqq','kaixin001','bdxc','tqf']
    }]
}
with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];


