Vue.use(VueRouter);

var App = new Vue({
  el: '#app',

  data: function() {
    return {
      AppName: "Test",
      route: null
    }
  },
  components: {
    home: {
      template: '<h4>Home</h4>'
    },
    message: {
      data: function() {
        return {
          message: null,
          attached: null
        }
      },
      attached: function() {
        this.attached = this.route.params.msg;
      },
      template: '<p>Data is: <strong>{{ message }}</strong></p>'
        + '<p>Route Param is: <strong>{{ route.params.msg }}</strong></p>'
        + '<p>Attached Message: <strong>{{ attached }}</strong></p>'
    }
  }
});

var router = new VueRouter({
  // pushstate: true,
  root: '/'
});

router.map({
  '/': {
    component: 'home',
  },
  '/message/:msg': {
    component: 'message',
    data: function(route, resolve, reject) {
      setTimeout(function() {
        resolve({
          message: route.params.msg
        })
      }, 500)
    }
  }
});

router.start(App, '#app');