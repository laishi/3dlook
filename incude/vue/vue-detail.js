Vue.config.debug = true;

Vue.use(VueRouter)

var App = Vue.extend({})

var router = new VueRouter()

Vue.component('app-page', {
    template: '#userBlock',

    data: function() {
      return{
        
        users: []
      }
    },

    ready: function () {
      this.fetchUsers();
    },

    methods: {
      fetchUsers: function(){
        var users = [
          {
            id: 1,
            name: 'tom'
          },
          {
            id: 2,
            name: 'brian'
          },
          {
            id: 3,
            name: 'sam'
          },
        ];

      this.$set('users', users);
      }
    }
})

Vue.component('newtemp', {
    template: '#newtemp',
     route: {
       data: function(transition) {
            transition.next({
                // saving the id which is passed in url to $data
                name: transition.to.params.name
            });
        }
     },
    data: function() {
        return {
            name:name,
          }
       },
})


router.map({
    '/': {
        component: Vue.component('app-page')
        },
    'new/:name': {
        name: 'new',
        component: Vue.component('newtemp')
    },
  
})

router.start(App, '#page-content')