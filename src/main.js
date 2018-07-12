import Vue from 'vue'

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)

import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import ActiveUser from './components/ActiveUser.vue'
import PendingUser from './components/PendingUser.vue'
import Transaction from './components/Transaction.vue'
import Schedule from './components/Schedule.vue'

// Vue.axios.defaults.baseURL = '//13.229.69.37/';

const routes = [
	{ path: '*', redirect: '/login' },
	{ path: '/login', component: Login/*, meta: { auth: false }*/ },
	{
		path: '/', component: Dashboard,
		children: [
			// { path: '/users/:status', component: User },
			{ path: '/users/active', component: ActiveUser },
			{ path: '/users/pending', component: PendingUser },
			{ path: '/transactions', component: Transaction },
			{ path: '/schedules', component: Schedule },
		]
	}
];

const router = new VueRouter({
	// linkActiveClass: 'active', // set as default value for active links
	routes
});

Vue.router = router

Vue.use(require('@websanova/vue-auth'), {
	auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
	http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
	router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
	loginData: {url: 'http://13.229.69.37/admin/login', method: 'POST', redirect: '/'},
	tokenDefaultName: 'auth_token',
	refreshData: { enabled: false },
	fetchData: { enabled: false }
})

new Vue({
	render: h => h(App),
	router
}).$mount('#app')
