<template>
	<div>
		<div class="row mb-3">
			<div class="col">
				<div class="form-inline">
				  <label class="my-1 mr-2" for="labelUserStatus">List of </label>
				  <select class="custom-select my-1 mr-sm-2" id="labelUserStatus" v-model="selectedUserStatus">
				    <option value="pending">Pending Change Limit</option>
				    <option value="rejected">Rejected Change Limit</option>
				    <option value="approved">Approved Change Limit</option>
						<!-- <option value="review">In Review</option> -->
				  </select>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<component :is="currentUserStatus"></component>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	data() {
		return {
			selectedUserStatus: 'pending',
			requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      }
		}
	},
	computed: {
		currentUserStatus() {
			this.actionAdmin(this.selectedUserStatus)
			console.log('selectedUserStatus', this.selectedUserStatus + '-change-limit')
			return this.selectedUserStatus + '-change-limit'
		}
	},
	methods: {
		decodeJwt(paramToken) {
      const b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map.call(atob(str), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
      );

      return parseJwt(paramToken)
    },
    actionAdmin(paramsAction) {
      let vm = this
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: `click option ${paramsAction} user`,
      }
			actionAdmin = JSON.stringify(actionAdmin)

			axios
        .post('https://mon.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
			// console.log('actionAdmin', actionAdmin)
    }
	}
}
</script>
