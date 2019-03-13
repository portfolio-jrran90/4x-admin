<template>
	<div>
		<nav aria-label="breadcrumb">
		  <ol class="breadcrumb">
		    <li class="breadcrumb-item">
		    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
		    </li>
		    <li class="breadcrumb-item active" aria-current="page">Fee</li>
		  </ol>
		</nav>
		<div class="row">
			<div class="col">
				<a href="#" @click.prevent="openModal('AddFee')" class="btn btn-success px-4">
					<font-awesome-icon icon="plus" /> Add Fee
				</a>
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th>Type</th>
							<th>Description</th>
							<th style="text-align: right !important">
								Amount
							</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in fees">
							<td>{{ data.type }}</td>
							<td>{{ data.description }}</td>
							<td class="text-right">{{ data.amount | currency }}</td>
							<td class="text-right">
								<a href="#" @click.prevent="openModal('EditFee', data, index)" v-b-tooltip.hover title="Edit fee" class="mr-2">
									<font-awesome-icon icon="edit" />
								</a>
								<a href="#" @click.prevent="deleteFee(data, index)" v-b-tooltip.hover title="Remove fee">
									<font-awesome-icon icon="trash-alt" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddFee" title="Add Fee" size="sm" hide-footer>
			<form @submit.prevent="formValidator('frmAddFee')" data-vv-scope="frmAddFee">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalAddFeeInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmAddFee.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddFee.type') }}</small>
					  </div>
					  <div class="form-group">
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter description" style="height: 140px" name="description" 
					    					v-model="modalAddFeeInput.description"
					    					:class="{ 'is-invalid': errors.first('frmAddFee.description') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmAddFee.description') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control text-right" placeholder="Enter amount" name="amount" 
					    			 v-model="modalAddFeeInput.amount"
					    			 :class="{ 'is-invalid': errors.first('frmAddFee.amount') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddFee.amount') }}</small>
					  </div>
					</div>
				</div>
	      <div slot="modal-footer">
	        <button type="button"class="btn btn-secondary mr-2" @click="modalAddFee=false">Close</button>
	        <button type="submit" class="btn btn-primary">Add fee</button>
	      </div>
      </form>
		</b-modal>

		<b-modal v-model="modalEditFee" title="Edit Fee" size="sm" hide-footer>

			<form @submit.prevent="formValidator('frmEditFee')" data-vv-scope="frmEditFee">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control text-right" placeholder="Enter amount" name="amount" 
					    			 v-model="modalEditFeeInput.amount"
					    			 :class="{ 'is-invalid': errors.first('frmEditFee.amount') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditFee.amount') }}</small>
					  </div>
					</div>
				</div>
	      <div slot="modal-footer">
	        <button type="submit" class="btn btn-primary mr-2">Update fee</button>
	        <button type="button" class="btn btn-secondary" @click="modalEditFee=false">Close</button>
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
			fees: {},

			// add
			modalAddFee: false,
			modalAddFeeInput: {},

			// edit
			modalEditFee: false,
			modalEditFeeInput: {},
		}
	},
	created() {
		this.indexFee()
	},
	methods: {
		/**
		 * Open a modal
		 * 
		 * @param  String type
		 * @param  Object data
		 * @param  Integer index
		 */
		openModal(type, data, index) {
			let vm = this

			vm.$validator.reset()

			switch(type) {
				case 'AddFee':
					vm.modalAddFeeInput = {}
					vm.modalAddFee = true
					break
				case 'EditFee':
					vm.modalEditFeeInput = {
						_id: data._id,
						amount: data.amount,
						index: index,
					}
					vm.modalEditFee = true
					break
				default: //
			}
		},

		/**
		 * Form Validator
		 *
		 * This will validate multiple forms
		 * 
		 * @param  String scope
		 */
		formValidator(scope) {
			let vm = this

			vm.$validator.validateAll(scope).then(result => {
				if (result) {
					switch (scope) {
						case 'frmAddFee': 	vm.addFee(); 		break
						case 'frmEditFee': 	vm.updateFee();	break
						default: //
					}
				}
			})
		},

		/**
		 * Index Fee
		 */
		indexFee() {
			axios.get(`${process.env.VUE_APP_API_URL}/api/fees`, {
				headers: {
					'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token"),
				}
			}).then(res => this.fees = res.data)
		},

		/**
		 * Save
		 */
		addFee() {
			let vm = this

    	axios.post(`${process.env.VUE_APP_API_URL}/api/fees`, vm.modalAddFeeInput, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
    	}).then(res => {
				alert('Fee Added!')
				vm.fees.push(res.data)
				vm.modalAddFee = false
    	})
		},

		/**
		 * Update
		 */
		updateFee() {
			let vm = this

    	axios.put(`${process.env.VUE_APP_API_URL}/api/fees/${vm.modalEditFeeInput._id}`, { amount: vm.modalEditFeeInput.amount }, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
    	}).then(res => {
				alert('Fee Updated!')
				vm.fees[vm.modalEditFeeInput.index].amount = res.data.amount
				vm.modalEditFee = false
    	})
		},

		/**
		 * Delete
		 */
		deleteFee(data, index) {
			let vm = this

			if (confirm('Are you sure you want to remove ' + data.type + '?')) {
	    	axios.delete(`${process.env.VUE_APP_API_URL}/api/fees/${data._id}`, {
		      headers: {
		        'Authorization': process.env.VUE_APP_AUTHORIZATION,
		        'x-access-token': localStorage.getItem("auth_token")
		      }
	    	}).then(res => {
					alert('Fee removed!')
					vm.fees.splice(index, 1)
					vm.modalEditFee = false
	    	})
    	}
		},
	}
}
</script>