<template>
	<div>
		<div class="row">
			<div class="col">
				<router-link :to="{ name: 'settings-email-template' }" class="btn btn-block py-4 btn-outline-primary">
					<font-awesome-icon icon="envelope" class="mr-2" size="lg" />
					Email Template
				</router-link>
			</div>
			<div class="col">
				<router-link :to="{ name: 'settings-fee' }" class="btn btn-block py-4 btn-outline-primary">
					<font-awesome-icon icon="coins" class="mr-2" size="lg" />
					Fee
				</router-link>
			</div>
			<div class="col">
				<router-link :to="{ name: 'settings-user-management' }" class="btn btn-block py-4 btn-outline-primary">
					<font-awesome-icon :icon="['fas', 'user-friends']" class="mr-2" size="lg" />
					User Management
				</router-link>
			</div>
			<div class="col">
				<router-link :to="{ name: 'settings-salary' }" class="btn btn-block py-4 btn-outline-primary">
					<font-awesome-icon :icon="['fas', 'coins']" class="mr-2" size="lg" />
					Salary
				</router-link>
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