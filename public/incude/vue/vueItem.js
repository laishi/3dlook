var png = ".png"
var jpg = ".jpg"
var HtmlFormat = ".html"




//  WORK

var db = new loki('workDB.json');
var workCol = db.addCollection('workCol');


var workNames = ["x50", "glmg", "ring", "iwatch", "moto", "edge", "shave", "house"];
var workWebglFolder = "public/webgl/case/";
var workHtmlFolder = "public/pages/work/";
var workImgFolder = "public/assets/img/workImg/";

var workImgkUrls = [];
var workHtmlUrls = [];
var workTitles = [];
var workSummary = [];

$.each(workNames, function(index, title) {


    var workWebglUrl = workWebglFolder + title;
    var workHtmlUrl = workHtmlFolder + title + HtmlFormat;
    var workimgkUrl = workImgFolder + title + png;

    var workOBJ = {};
    workOBJ.id = index;
    workOBJ.useClass = title;
    workOBJ.title = title;
    workOBJ.link3d = workWebglUrl;
    workOBJ.link = workHtmlUrl;
    workOBJ.image = workimgkUrl;

    workCol.insert(workOBJ);

    var useClass = "." + title;
    workHtmlUrls.push(workHtmlUrl);
    workImgkUrls.push(workimgkUrl);



    $.ajax({
        url: workHtmlUrl,
        async: false,
        success: function(data) {
            title = $(data).filter('title').text();
            summary = $(data).filter(useClass).text();

            workOBJ.title = title;
            workOBJ.summary = summary;
        }
    });

})

//  BLOG

var db = new loki('blogDB.json');
var blogCol = db.addCollection('blogCol');


var blogNames = ["waveLoader", "playcanvas-introduce","playcanvas-pbr", "modoSoft", "lokiJS", "nodemongo" ];
var blogHtmlFolder = "public/pages/blog/";
var blogImgFolder = "public/assets/img/blogImg/";




$.each(blogNames, function(index, title) {


    var blogHtmlUrl = blogHtmlFolder + title + HtmlFormat;
    var blogimgkUrl = blogImgFolder + title + jpg;

    var blogOBJ = {};
    blogOBJ.id = index;
    blogOBJ.useClass = title;
    blogOBJ.link = blogHtmlUrl;
    blogOBJ.image = blogimgkUrl;


    $.ajax({
        url: blogHtmlUrl,
        async: false,
        success: function(data) {
            blogOBJ.title           = $(data).filter('title').text();
            blogOBJ.date            = $(data).find('.date').text();
            blogOBJ.author          = $(data).find('.author').text();
            blogOBJ.tags          = $(data).find('.tags').text();
            blogOBJ.category        = $(data).find('.category').text();
            blogOBJ.summary         = $(data).find('.summary').text().substring(0,200) + "...";
        }
    });

    blogCol.insert(blogOBJ);
})


// db.saveDatabase(function () {
//     console.log("save db")
// });


var workdv = workCol.addDynamicView('workCol_view');
workdv.applyWhere(function customFilter(obj){
    return obj.id  > -1;
});

workdv.applySimpleSort('id')



var blogdv = blogCol.addDynamicView('blogCol_view');

blogdv.applyWhere(function customFilter(obj){

    return obj.id  > -1;

});

blogdv.applySimpleSort('id')





var lookVue = new Vue({
    el: '.pages',
    data: {

        work: workdv.data(),
        blog: blogdv.data()
    },



    computed: {
    },
    created: function() {
    },
    ready: function() {
    },
    destroyed: function() {
    },
    methods: {

      showDetail:function (index) {
        console.log(index)
      }


    }
});


console.log(lookVue.work[0].title)









var notFound = Vue.extend({
   template: '<h1>Not Found</h1>' +
   '<router-view></router-view>'
})

var workComponent = Vue.extend({

})

var blogComponent = Vue.extend({

})

var aboutComponent = Vue.extend({

})

var contactComponent = Vue.extend({

})


var detail = Vue.extend({

})




Vue.config.debug = true;

Vue.use(VueRouter)

var router = new VueRouter({
   history: false,
   hashbang:true,
   // saveScrollPosition:true,
   root: '/'
})






Vue.component('newtemp', {
    template: '#workVUE',
     route: {
       data: function(transition) {
            transition.next({
                // saving the id which is passed in url to $data
                itemName: transition.to.params.itemName
            });
        }
     },
    data: function() {
        return {
            itemName:itemName,
          }
       },
})


// router.alias({
//     '/': '/work'
// })



router.map({
   // '*': {
   //    component: notFound
   // },


   '/work': {
      component: workComponent,
   },

   '/blog': {
      component: blogComponent,
   },

   '/about': {
      component: aboutComponent,
   },

   '/contact': {
      component: contactComponent
   },


  '/detail/:itemName': {
    name: 'detail', // 给这条路径加上一个名字
    component: Vue.component('newtemp')
  },



});





var App = Vue.extend()

router.start(App, 'body')
