import Vue from 'vue';
import VCalendar from 'v-calendar';
import VueSweetalert2 from 'vue-sweetalert2';
import VueMoment from 'vue-moment';
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
// import $ from 'jquery'; 


/*  
  *
  * FontAwesome Library
  *
*/
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faHome,
} from '@fortawesome/free-solid-svg-icons'
import { 
  faTwitter,
  faLinkedin,
  faFacebookSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faHome,
  faTwitter,
  faLinkedin,
  faFacebookSquare,
)
Vue.component('font-awesome-icon', FontAwesomeIcon)




import App from './App.vue';
import router from './router';



// import 'v-calendar/lib/v-calendar.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/styles/font.css';
import './assets/styles/index.css';



const options = {
  confirmButtonColor: '#0392CF',
  cancelButtonColor: '#FF5959',
};




Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.use(VCalendar);
Vue.use(VueSweetalert2,options);
Vue.use(VueMoment);

Vue.directive('hide-on-click-outside', {
  bind(el, binding, vnode){
    // $("body").click(function (e) {
    //   if ($(e.target).parents(".per-page-pagination").length === 0) {
    //     $(".per_page").hide();
    //   }
    // });
    console.log(el);
    console.log(binding);
    console.log(vnode);
    window.addEventListener("click",function(e){
      console.log(e);
      console.log(e.target);
      console.log(el);
      console.log(binding.value);
      // console.log(document.querySelector('div.user-menu-item'));
      // console.log(document.querySelector(e).closest(binding.value));
      // if (e.target.parents(el.value).length === 0){
      //   // Clicked in box
      //   console.log('out');
      // }else{
      //   console.log('in');
      // }
      const parents = getParents(e.target, el);
      console.log(parents);
      [0].style.visibility = 'hidden'
    });

    function getParents(el, parentSelector) {
      if (parentSelector === undefined) {
        parentSelector = document;
      }
      var p = el.parentNode;
      var parentMatch = false;
      while (p !== parentSelector) {
        var o = p;
        if(o == null){
          break;
        }
        p = o.parentNode;
        if(p == parentSelector){
          console.log('MATCH');
          parentMatch = true;
        }
      }
      return parentMatch;
    }
  }
})



Vue.config.productionTip = false;

// const $ = require('jquery');
// window.$ = $; 

Vue.router = router;
Vue.use(require('@websanova/vue-auth'), {
  auth: {
    request(req, token) {
      this.options.http._setHeaders.call(this, req, {
        Authorization: `Bearer ${token}`,
      })
    },
    response(res) {
      var token = res.data.token
      if (token) {
        token = token.split(/Bearer\:?\s?/i) //eslint-disable-line
        return token[token.length > 1 ? 1 : 0].trim()
      }
    },
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: {
    url: '/api/auth/login',
    method: 'POST',
    redirect: '/login',
  },
  authRedirect: { path: '/api/auth/login' },
  tokenDefaultName: 'auth_token',
  refreshData: { enabled: false },
  fetchData: { enabled: false },
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
