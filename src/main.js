import Vue from 'vue'

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Custom CSS
require('./assets/styles.scss')

import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMoment from 'vue-moment'
import VueSweetalert2 from 'vue-sweetalert2'

//vue-datetime
import Datetime from 'vue-datetime'
// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css'
Vue.use(Datetime)

//vue-select
import vSelect from 'vue-select'
import 'vue-select/src/scss/vue-select.scss'
Vue.component('v-select', vSelect)

//vue-json-excel
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// Viewer
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

// Font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSignInAlt,
  faStore,
  faHandshake,
  faBullhorn,
  faUserFriends,
  faSearch,
  faUserSlash,
  faUserEdit,
  faPlusSquare,
  faCog,
  faEnvelope,
  faCoins,
  faEdit,
  faPlus,
  faTrashAlt,
  faTimes,
  faCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faSignInAlt,
  faUser,
  faUserEdit,
  faStore,
  faHandshake,
  faBullhorn,
  faUserFriends,
  faSearch,
  faUserSlash,
  faPlusSquare,
  faCog,
  faEnvelope,
  faCoins,
  faEdit,
  faPlus,
  faTrashAlt,
  faTimes,
  faCheck,
  faSpinner
  )
Vue.component('font-awesome-icon', FontAwesomeIcon)

import VeeValidate from 'vee-validate';
// Filters
import './filters/index'

import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(VueMoment)
Vue.use(VueSweetalert2)
Vue.use(VeeValidate)
Vue.use(Viewer)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCkjWXef2lDguLgq1Pk9cUkWQd3ReWXXaQ',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then disable the following:
  // installComponents: true,
})

Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL

import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

import Transaction from './components/Transaction.vue'
import ApprovePromo from './components/ApprovePromo.vue'
import AddMerchantUser from './components/AddMerchantUser.vue'
import AllPromotion from './components/AllPromotion.vue'
import AddCategory from './components/AddCategory.vue'
import AssignCategory from './components/AssignCategory.vue'

// User
import User from './components/users/Index.vue'
Vue.component('active-user', require('./components/users/ActiveUser').default)
Vue.component('pending-user', require('./components/users/PendingUser').default)
Vue.component('incomplete-user', require('./components/users/Incomplete').default)
Vue.component('banned-user', require('./components/users/BannedUser').default)
Vue.component('freeze-user', require('./components/users/FreezeUser').default)
Vue.component('rejected-user', require('./components/users/Rejected').default)
Vue.component('approved-user', require('./components/users/Approved').default)
require('./components/users') // this is for shared components

// Change Limit
import ChangeLimit from './components/change-limit/Index.vue'
Vue.component('pending-change-limit', require('./components/change-limit/PendingUser').default)
Vue.component('rejected-change-limit', require('./components/change-limit/Rejected').default)
Vue.component('approved-change-limit', require('./components/change-limit/Approved').default)
require('./components/change-limit') // this is for shared components

// Merchants
import Merchant from './components/merchants/Index.vue'
import MerchantFee from './components/merchants/MerchantFee.vue'

// Promotions
import Promotion from './components/promotions/Index.vue'

// FailedTransactions
import FailedTransactions from './components/transactions/Index.vue'

// Help Desk
import HelpDesk from './components/helpdesk/Index.vue'

// Settings
import Settings from './components/settings/__Main.vue'
import SettingsIndex from './components/settings/Index.vue'
import SettingsEmailTemplate from './components/settings/EmailTemplate.vue'
import SettingsSmsTemplate from './components/settings/SmsTemplate.vue'
import SettingsFee from './components/settings/Fee.vue'
import SettingsUserManagement from './components/settings/UserManagement.vue'
import SettingsSalary from './components/settings/Salary.vue'


const routes = [
  { path: '*', redirect: '/login' },
  { path: '/login', component: Login, meta: { auth: false } },
  {
    path: '/',
    component: Dashboard,
    redirect: '/users',
    name: 'dashboard',
    meta: { auth: true },
    children: [
      { path: '/merchants', component: Merchant, name: 'merchant' },
      // { path: '/merchant-fee', component: MerchantFee, name: 'merchant-fee' },
      { path: '/users', component: User },
      { path: '/change-limit', component: ChangeLimit },
      { path: '/transactions', component: Transaction },
      { path: '/approvepromo', component: ApprovePromo },
      { path: '/addmerchantuser', component: AddMerchantUser },
      { path: '/allpromotion', component: AllPromotion },
      { path: '/addcategory', component: AddCategory },
      { path: '/assigncategory', component: AssignCategory },
      // { path: '/inreview', component: InReview },

      { path: '/promotions', component: Promotion, name: 'promotion' },
      { path: '/transactions-failed', component: FailedTransactions, name: 'transaction' },//failed transaction
      { path: '/help-desk', component: HelpDesk, name: 'helpdesk' },

      // Settings
      {
        path: '/settings/', component: Settings, name: 'settings', redirect: '/settings/',
        children: [
          { path: '/', component: SettingsIndex, name: 'settings-index' },
          { path: 'email-template', component: SettingsEmailTemplate, name: 'settings-email-template' },
          { path: 'sms-template', component: SettingsSmsTemplate, name: 'settings-sms-template' },//sms template
          { path: 'fee', component: SettingsFee, name: 'settings-fee' },
          { path: 'user-management', component: SettingsUserManagement, name: 'settings-user-management' },
          { path: 'salary', component: SettingsSalary, name: 'settings-salary' },
        ],
      },
    ],
  },
]

const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes,
})

Vue.router = router

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
        token = token.split(/Bearer\:?\s?/i)
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
  render: h => h(App),
  router,
}).$mount('#app')
