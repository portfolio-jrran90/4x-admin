import Vue from 'vue';

// Bootstrap
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Custom CSS
require('./assets/styles.scss');

import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueMoment from 'vue-moment';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(VueMoment);

Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import ActiveUser from './components/ActiveUser.vue';
import PendingUser from './components/PendingUser.vue';
import Transaction from './components/Transaction.vue';
import ApprovePromo from './components/ApprovePromo.vue';
import AddMerchantUser from './components/AddMerchantUser.vue';
import AllPromotion from './components/AllPromotion.vue';

const routes = [
  { path: '*', redirect: '/login' },
  { path: '/login', component: Login, meta: { auth: false } },
  {
    path: '/',
    component: Dashboard,
    redirect: '/users/active',
    name: 'dashboard',
    meta: { auth: true },
    children: [
      // { path: '/users/:status', component: User },
      { path: '/users/active', component: ActiveUser },
      { path: '/users/pending', component: PendingUser },
      { path: '/transactions', component: Transaction },
      { path: '/approvepromo', component: ApprovePromo },
      { path: '/addmerchantuser', component: AddMerchantUser },
      { path: '/allpromotion', component: AllPromotion },
    ],
  },
];

const router = new VueRouter({
  // hashbang: false,
  linkActiveClass: 'active', // set as default value for active links
  mode: 'history',
  routes,
});

Vue.router = router;

Vue.use(require('@websanova/vue-auth'), {
  auth: {
    request(req, token) {
      this.options.http._setHeaders.call(this, req, {
        Authorization: `Bearer ${token}`,
      });
    },
    response(res) {
      var token = res.data.jwt;
      if (token) {
        token = token.split(/Bearer\:?\s?/i);
        return token[token.length > 1 ? 1 : 0].trim();
      }
    },
  },
  // auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: {
    url: `${process.env.VUE_APP_API_URL}/auth`,
    method: 'POST',
    redirect: '/login',
  },
  authRedirect: { path: `${process.env.VUE_APP_API_URL}/auth` },
  tokenDefaultName: 'auth_token',
  refreshData: { enabled: false },
  fetchData: { enabled: false },
});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
