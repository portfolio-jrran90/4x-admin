import Vue from 'vue'

// Format Date
Vue.filter('date', date => {
  let options = {year: 'numeric', month: '2-digit', day: '2-digit'};
  return Intl.DateTimeFormat('en-US', options).format(date)
})

/**
 * Format currency
 */
Vue.filter('currency', amount => {
	return Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(amount)
})

/**
 * Capitalize first word
 */
Vue.filter('ucfirst', string => {
	return string.charAt(0).toUpperCase() + string.slice(1)
})
