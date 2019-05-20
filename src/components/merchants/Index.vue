<template>
	<div>
		<h2 class="mb-4">
			<font-awesome-icon :icon="['fas', 'store']" class="mr-2" /> Merchants
			<a href="#" class="btn btn-secondary float-right" @click="openModal('AddMerchant')">&plus; Add a merchant</a>
		</h2>
		<div class="row">
			<div class="col">
        <table class="table table-hover table-striped tbl-merchants">
          <thead>
            <tr>
							<th>Details</th>
							<th style="text-align: right !important">Date registered</th>
            </tr>
          </thead>
					<tbody>
						<tr v-for="(data, index) in merchants">
							<td>
								<div class="main-info">
									<img :src="data.fImage || '/assets/img/no-image.svg'" :alt="data.name" class="rounded ml-2 mr-3">
									<div>
										<h4 class="mb-0">{{ data.name }}</h4>
										<p>
											{{ data.mobileNumber }}<br>
											{{ data.email }}<br>
											<a :href="data.website" target="_blank">Visit website</a>
										</p>
									</div>
								</div>
							</td>
							<td class="text-right">{{ new Date(data.createdAt) | date }}</td>
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
	.tbl-merchants {
		.main-info {
			display: flex;
			align-items: center;
			img {
				height: 100px;
				width: 100px;
			}
			p { font-size: 14px }
			a { font-size: 13px }
		}
	}
</style>