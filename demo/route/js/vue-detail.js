Vue.config.debug = true;

Vue.use(VueRouter)

var App = Vue.extend({})

var router = new VueRouter()


var users = [{
    id: 1,
    useClass: 'x50'
}, {
    id: 2,
    useClass: 'glmg'
}, {
    id: 3,
    useClass: 'shave'
}, ];



Vue.component('app-page', {
    template: '#userBlock',

    data: function() {
        return {

            work: users
        }
    },
})





// Vue.component('newtemp', {
//     route: {
//         data: function(transition) {
//             transition.next({
//                 // saving the id which is passed in url to $data
//                 namessssss: transition.to.params.name
//             });
//         }
//     },
// })




router.map({


    '/': {
        component: Vue.component('app-page')
    },
    'detail/:itemName': {
        name: 'detail',
        component: Vue.component('newtemp')
    },



})













router.start(App, '#page-content')
