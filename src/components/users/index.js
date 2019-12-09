import Vue from 'vue'

Vue.component('user-details', require('./__shared/UserDetails').default)
Vue.component('transaction-details', require('./__shared/TransactionDetails').default)

// next will be use this component, for now the review detail page in the review parent
// =>
// Vue.component('in-review-user', require('./__shared/in-reviewDetails').default)
