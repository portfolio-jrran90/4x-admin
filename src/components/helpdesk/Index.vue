<template>
	<div>
		<h2>
			<font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" /> Help Desk
		</h2>
		<div class="row">
			<div class="col">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero ut vel earum eaque doloremque, delectus eum rem ex, quam quae quos suscipit nostrum mollitia iste corrupti cumque voluptate labore dolor!
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