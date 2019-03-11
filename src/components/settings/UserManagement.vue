<template>
	<div>
	  <ol class="breadcrumb">
	    <li class="breadcrumb-item">
	    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
	    </li>
	    <li class="breadcrumb-item active" aria-current="page">User Management</li>
	  </ol>
		<div class="row">
			<div class="col">
				<button class="btn btn-block py-4 btn-outline-primary">
					<font-awesome-icon icon="envelope" class="mr-2" size="lg" />
					Email Template
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			// 
		}
	},
	methods: {
		/**
		 * Open a modal
		 * 
		 * @param  {[type]} type
		 * @param  {[type]} data 'Object of data'
		 */
		openModal(type, data) {
			let vm = this
			switch(type) {
				case '':
					break
				default: //
			}
		},
	}
}
</script>