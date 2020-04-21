<template>
	<div>
		<h2 class="mb-4">
			<font-awesome-icon :icon="['fas', 'coins']" class="mr-2" /> Merchant Fee
		</h2>
		<div class="row">
			<div class="col">
        <table class="table table-hover table-striped table-bordered tbl-merchant-fee">
          <thead>
            <tr class="border">
							<th rowspan="2">Merchant</th>
							<th>2 Weeks</th>
							<th>1 Month</th>
            </tr>
            <tr>
            	<th>Convenience Fee</th>
            	<th>Convenience Fee</th>
            </tr>
          </thead>
					<tbody>
						<tr>
							<td>Merchant 1</td>
							<td class="text-right">
								Rp. 100
								<a href="#" class="ml-2">
									<font-awesome-icon :icon="['fas', 'edit']" class="" size="sm" />
								</a>
							</td>
							<td class="text-right">
								Rp. 100
								<a href="#" class="ml-2">
									<font-awesome-icon :icon="['fas', 'edit']" class="" size="sm" />
								</a>
							</td>
						</tr>
					</tbody>
        </table>
      </div>
		</div>

		<!-- modal -->
    <b-modal title="Merchant Registration" v-model="modalAddMerchant" size="sm" hide-footer>
    	<form @submit.prevent="formValidator('frmAddMerchant')" id="frmAddMerchant" data-vv-scope="frmAddMerchant">
				<div class="mb-1">
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter name" name="name"
				    	v-model="addMerchant.name"
              v-validate="'required'"
							:class="{'is-invalid': errors.first('frmAddMerchant.name')}">
						<div class="invalid-feedback">{{ errors.first('frmAddMerchant.name') }}</div>
				  </div>
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter username" name="username"
				    	v-model="addMerchant.username"
							v-validate="'required'"
              :class="{'is-invalid': errors.first('frmAddMerchant.username')}">
            <div class="invalid-feedback">{{ errors.first('frmAddMerchant.username') }}</div>
				  </div>
				  <div class="form-group">
				    <input type="email" class="form-control" placeholder="Enter email" name="email" 
				    	v-model="addMerchant.email"
							v-validate="'required'"
              :class="{'is-invalid': errors.first('frmAddMerchant.email')}">
            <div class="invalid-feedback">{{ errors.first('frmAddMerchant.email') }}</div>
				  </div>
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter mobile" name="mobile_no" 
				    	v-model="addMerchant.mobileNumber"
							v-validate="'required'"
              :class="{'is-invalid': errors.first('frmAddMerchant.mobile_no')}">
            <div class="invalid-feedback">{{ errors.first('frmAddMerchant.mobile_no') }}</div>
				  </div>
				</div>
				<div slot="modal-footer" class="w-100 text-center">
				 	<button type="submit" class="btn btn-primary mr-2">Register</button>
				 	<button type="button" class="btn btn-default" @click="modalAddMerchant=false">Cancel</button>
				</div>
			</form>
    </b-modal>
	</div>
</template>

<script>
// 2. sweet alert

import axios from 'axios'

export default {
	data() {
		return {
			requestedHeaders: {
	      headers: {
	        Authorization: process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
			},
			modalAddMerchant: false,
			addMerchant: {},
			merchants: {}
		}
	},
	created() {
		this.indexMerchants()
  },
	methods: {

		/**
		 * List all merchants
		 */
		indexMerchants() {
			let vm = this
	    axios.get('/api/merchants', vm.requestedHeaders).then(res => vm.merchants = res.data)
		},

    /**
     * Form Validator
     * This will validate multiple forms
     * 
     * @param  String scope
     */
    formValidator(scope) {
      let vm = this
      vm.$validator.validateAll(scope).then(result => {
        if (result) {
          switch (scope) {
            case 'frmAddMerchant':   vm.register();      break
            default: //
          }
        }
      })
    },

		/**
		 * Open a modal
		 * @param  {[type]} type
		 * @param  {[type]} data 'Object of data'
		 */
		openModal(type, data) {
			let vm = this
			switch(type) {
				case 'AddMerchant':
					vm.addMerchant = {}
					vm.modalAddMerchant = true
					break
				default: //
			}
		},

		/**
		 * Merchant Registration
		 */
		register() {
			let vm = this
			axios
				.post('/api/merchants', vm.addMerchant, vm.requestedHeaders)
				.then(res => {
					vm.$swal('Success!', 'New merchant added!', 'success')
					vm.indexMerchants()
					vm.modalAddMerchant = false
				})
				.catch(err => {
					vm.$swal('Error!', err.response.data.message, 'error')
				})
		}
	}
}
</script>

<style lang="scss" scoped>
	.tbl-merchant-fee {
		thead tr {
			th { text-align: center !important }
			&:first-child th:first-child { text-align: left !important }
		}
	}
</style>