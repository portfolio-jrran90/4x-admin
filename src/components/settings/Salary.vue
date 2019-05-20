<template>
	<div>
		<nav aria-label="breadcrumb">
		  <ol class="breadcrumb">
		    <li class="breadcrumb-item">
		    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
		    </li>
		    <li class="breadcrumb-item active" aria-current="page">Salary</li>
		  </ol>
		</nav>
		<div class="row">
			<div class="col-md-7">
				<a href="#" @click.prevent="openModal('AddFee')" class="btn btn-success px-4">
					<font-awesome-icon icon="plus" /> Add Salary
				</a>
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th>Type</th>
							<th>Description</th>
							<th style="text-align: right !important">Credit</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in salaries">
							<td>{{ data.type }}</td>
							<td>{{ data.description }}</td>
							<td class="text-right">{{ data.credit | currency }}</td>
							<td class="text-right">
								<a href="#" @click.prevent="openModal('EditFee', data, index)" v-b-tooltip.hover title="Edit salary" class="mr-2">
									<font-awesome-icon icon="edit" />
								</a>
								<a href="#" @click.prevent="deleteSalary(data, index)" v-b-tooltip.hover title="Remove salary">
									<font-awesome-icon icon="trash-alt" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddSalary" title="Add Salary" size="sm" hide-footer>
			<form @submit.prevent="formValidator('frmAddSalary')" data-vv-scope="frmAddSalary">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalAddSalaryInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmAddSalary.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddSalary.type') }}</small>
					  </div>
					  <div class="form-group">
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter description" style="height: 140px" name="description" 
					    					v-model="modalAddSalaryInput.description"
					    					:class="{ 'is-invalid': errors.first('frmAddSalary.description') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmAddSalary.description') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control text-right" placeholder="Enter credit" name="credit" 
					    			 v-model="modalAddSalaryInput.credit"
					    			 :class="{ 'is-invalid': errors.first('frmAddSalary.credit') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddSalary.credit') }}</small>
					  </div>
					</div>
				</div>
	      <div slot="modal-footer" class="w-100 text-center">
	        <button type="submit" class="btn btn-primary px-4 mr-2">Add</button>
	        <button type="button"class="btn btn-secondary px-4" @click="modalAddSalary=false">Close</button>
	      </div>
      </form>
		</b-modal>

		<b-modal v-model="modalEditSalary" title="Edit Salary" size="sm" hide-footer>
			<form @submit.prevent="formValidator('frmEditSalary')" data-vv-scope="frmEditSalary">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalEditSalaryInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmEditSalary.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditSalary.type') }}</small>
					  </div>
					  <div class="form-group">
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter description" style="height: 140px" name="description" 
					    					v-model="modalEditSalaryInput.description"
					    					:class="{ 'is-invalid': errors.first('frmEditSalary.description') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmEditSalary.description') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control text-right" placeholder="Enter credit" name="credit" 
					    			 v-model="modalEditSalaryInput.credit"
					    			 :class="{ 'is-invalid': errors.first('frmEditSalary.credit') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditSalary.credit') }}</small>
					  </div>
					</div>
				</div>
	      <div slot="modal-footer" class="w-100 text-center">
	        <button type="submit" class="btn btn-primary px-4 mr-2">Update</button>
	        <button type="button" class="btn btn-secondary px-4" @click="modalEditSalary=false">Close</button>
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
	        'x-access-token': localStorage.getItem("auth_token"),
				}
			},

			salaries: {},

			// add
			modalAddSalary: false,
			modalAddSalaryInput: {},

			// edit
			modalEditSalary: false,
			modalEditSalaryInput: {},
		}
	},
	created() {
		this.indexSalary()
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
					vm.modalAddSalaryInput = {}
					vm.modalAddSalary = true
					break
				case 'EditFee':
					vm.modalEditSalaryInput = {
						_id: data._id,
						type: data.type,
						description: data.description,
						credit: data.credit,
						index: index,
					}
					vm.modalEditSalary = true
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
						case 'frmAddSalary': 	vm.addSalary(); 		break
						case 'frmEditSalary': 	vm.updateSalary();	break
						default: //
					}
				}
			})
		},

		/**
		 * Index Fee
		 */
		indexSalary() {
			let vm = this
			axios
				.get('/api/usersalary', vm.requestedHeaders)
				.then(res => vm.salaries = res.data)
		},

		/**
		 * Save
		 */
		addSalary() {
			let vm = this

    	axios
    		.post('/api/usersalary', vm.modalAddSalaryInput, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'New salary added!', 'success')
					vm.salaries.push(res.data)
					vm.modalAddSalary = false
	    	})
	    	.catch(err => {
	    		vm.$swal('Error!', err.response.data.message, 'error')
	    	})
		},

		/**
		 * Update
		 */
		updateSalary() {
			let vm = this

			console.log( vm.modalEditSalaryInput )

    	axios
    		.put(`/api/usersalary/${vm.modalEditSalaryInput._id}`, vm.modalEditSalaryInput, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'Salary updated!', 'success')
					vm.salaries[vm.modalEditSalaryInput.index].type = res.data.type
					vm.salaries[vm.modalEditSalaryInput.index].description = res.data.description
					vm.salaries[vm.modalEditSalaryInput.index].credit = res.data.credit
					vm.modalEditSalary = false
	    	})
	    	.catch(err => {
	    		vm.$swal('Error!', err.response.data.message, 'error')
	    	})
		},

		/**
		 * Delete
		 */
		deleteSalary(data, index) {
			let vm = this
			if (confirm('Are you sure you want to remove ' + data.type + '?')) {
	    	axios
	    		.delete(`/api/usersalary/${data._id}`, vm.requestedHeaders)
	    		.then(res => {
						vm.$swal('Success!', 'Salary removed!', 'success')
						vm.salaries.splice(index, 1)
						vm.modalEditSalary = false
		    	})
    	}
		},
	}
}
</script>