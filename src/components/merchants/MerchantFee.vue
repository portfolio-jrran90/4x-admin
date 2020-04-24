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
						<tr v-for="data in merchants">
							<td>{{ data.name }}</td>
							<td class="text-right">
								{{ data.convenienceFee.twoWeekly | currency }}
								<a href="#" class="ml-2" @click.prevent="openModal('EditMerchantFee14', data)">
									<font-awesome-icon :icon="['fas', 'edit']" class="" size="sm" />
								</a>
							</td>
							<td class="text-right">
								{{ data.convenienceFee.monthly | currency }}
								<a href="#" class="ml-2" @click.prevent="openModal('EditMerchantFee30', data)">
									<font-awesome-icon :icon="['fas', 'edit']" class="" size="sm" />
								</a>
							</td>
						</tr>
					</tbody>
        </table>
      </div>
		</div>

		<!-- modal -->
    <b-modal title="Edit Merchant Fee" v-model="modalUpdateMerchantFee" size="sm" hide-footer>
    	<form @submit.prevent="formValidator('frmEditMerchantFee')" id="frmEditMerchantFee" data-vv-scope="frmEditMerchantFee">
				<div class="mb-1">
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter fee" name="fee"
				    	v-model="editMerchantFee.convenienceFee"
              v-validate="'required'"
							:class="{'is-invalid': errors.first('frmEditMerchantFee.fee')}">
						<div class="invalid-feedback">{{ errors.first('frmEditMerchantFee.fee') }}</div>
				  </div>
				</div>
				<div slot="modal-footer" class="w-100 text-center">
				 	<button type="submit" class="btn btn-primary mr-2">Update</button>
				 	<button type="button" class="btn btn-default" @click="modalUpdateMerchantFee=false">Cancel</button>
				</div>
			</form>
    </b-modal>
	</div>
</template>

<script>

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
			modalUpdateMerchantFee: false,
			editMerchantFee: {},

			merchants: {}
		}
	},
	created() {
		this.indexMerchantFee()
  },
	methods: {

		/**
		 * List all merchants
		 */
		indexMerchantFee() {
			let vm = this
	    axios.get('/api/merchants?limit=1000000', vm.requestedHeaders).then(res => vm.merchants = res.data)
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
            case 'frmEditMerchantFee':   vm.updateMerchantFee();      break
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

			vm.editMerchantFee['_id'] = data._id

			switch(type) {
				case 'EditMerchantFee14':
					vm.editMerchantFee['convenienceFee'] = data.convenienceFee.twoWeekly
					vm.editMerchantFee['type'] = 'twoWeekly'
					vm.modalUpdateMerchantFee = true
					break
				case 'EditMerchantFee30':
					vm.editMerchantFee['convenienceFee'] = data.convenienceFee.monthly
					vm.editMerchantFee['type'] = 'monthly'
					vm.modalUpdateMerchantFee = true
					break
				default: //
			}
		},

		/**
		 * Update Merchant Fee
		 */
		updateMerchantFee() {
			let vm = this
			let reqBody = {
				convenienceFee: {
					[vm.editMerchantFee.type]: parseFloat(vm.editMerchantFee.convenienceFee)
				}
			}
			axios
				.put(`/api/merchants/${vm.editMerchantFee._id}`, reqBody, vm.requestedHeaders)
				.then(res => {
					vm.$swal('Success!', 'Fee updated!', 'success')
					vm.indexMerchantFee()
					vm.modalUpdateMerchantFee = false
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