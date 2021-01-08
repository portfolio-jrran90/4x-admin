import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'


// import Auth from './views/Auth.vue'
import { Dashboard } from './views/Dashboard'
import { Users } from './views/Users'
import { UserVerificatonDetails } from './views/UserVerificatonDetails'


Vue.use(Router)
Vue.use(VueAxios, axios)




Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL


export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    { path: '*', redirect: '/'},
    // { path: '/auth', name: 'Auth', component: Auth },
    {
      path: '/',
      name: 'Dashboard',
      // redirect: '/users',
      component: Dashboard,
      // meta: { auth: true },
      children: [
        { name: 'Users', path: '/users', component: Users },
        { name: 'UserVerificatonDetails', path: '/user-verification', component: UserVerificatonDetails },
      ]
    },
    
  ]
})
