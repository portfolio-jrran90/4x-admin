<template>
	<div>
		<h2>
			<font-awesome-icon :icon="['fas', 'bullhorn']" class="mr-2" /> Promotion
		</h2>
		<div class="row">
			<div class="col-md-4">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>
								Category
								<a href="#" class="float-right" @click="openModal('AddCategory')">
									<font-awesome-icon icon="plus-square" size="lg" /> Add
								</a>
							</th>
						</tr>
					</thead>
					<tbody v-if="categories.length===0">
						<tr><td colspan="3">No record found!</td></tr>
					</tbody>
					<tbody v-else>
						<tr v-for="data in categories" @click="getCategoryDetails(data._id)" :class="{'table-active': data._id == catClassActive}">
							<td>{{ data.name }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="col">
				<h4>Details</h4>
				<table class="table table-bordered table-dark">
					<tbody>
						<tr>
							<td class="w-25 text-info">Name</td>
							<td>{{ catDtl.name }}</td>
						</tr>
						<tr>
							<td class="text-info">Description</td>
							<td>{{ catDtl.description }}</td>
						</tr>
						<tr>
							<td class="text-info">Type</td>
							<td>{{ catDtl.type }}</td>
						</tr>
						<tr>
							<td class="text-info">Date added</td>
							<td>{{ new Date(catDtl.createdAt) | date }}</td>
						</tr>
						<tr>
							<td class="text-info">Date updated</td>
							<td>{{ new Date(catDtl.updatedAt) | date }}</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="2">
								<button class="btn btn-info mr-2" @click="openModal('EditCategory', catDtl)">Update</button>
								<button class="btn btn-outline-danger" @click="removeCategory(catDtl._id)">Remove</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddCategory" title="Add Category" size="sm" ref="frmAddCategory" hide-footer>
			<form @submit.prevent="formValidator('frmAddCategory')" id="frmAddCategory" data-vv-scope="frmAddCategory">
				<div class="mb-1">
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter name" name="name" 
				    			 v-model="modalInputAddCategory.name"
				    			 :class="{ 'is-invalid': errors.first('frmAddCategory.name') }"
				    			 v-validate="'required'">
			      <small class="invalid-feedback">{{ errors.first('frmAddCategory.name') }}</small>
				  </div>
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter type" name="type" 
				    			 v-model="modalInputAddCategory.type"
				    			 :class="{ 'is-invalid': errors.first('frmAddCategory.type') }"
									 v-validate="'required'">
						<small class="invalid-feedback">{{ errors.first('frmAddCategory.type') }}</small>
				  </div>
				  <div class="form-group">
				  	<textarea class="form-control" placeholder="Enter description" style="height: 150px" name="description" 
				  						v-model="modalInputAddCategory.description"
				    			 		:class="{ 'is-invalid': errors.first('frmAddCategory.description') }"
									 		v-validate="'required'"></textarea>
						<small class="invalid-feedback">{{ errors.first('frmAddCategory.description') }}</small>
				  </div>
				</div>
				<div slot="modal-footer" class="w-100 text-center">
				 	<button type="submit" class="btn btn-primary px-4 mr-2">Add</button>
				 	<button type="button" class="btn btn-default px-4" @click="modalAddCategory=false">Cancel</button>
				</div>
			</form>
		</b-modal>


		<b-modal v-model="modalEditCategory" title="Update Category" @ok="updateCategory" size="sm" hide-footer>
			<form @submit.prevent="formValidator('frmEditCategory')" id="frmEditCategory" data-vv-scope="frmEditCategory">
				<div class="mb-1">
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter name" name="name" 
				    			 v-model="modalInputEditCategory.name"
				    			 :class="{ 'is-invalid': errors.first('frmEditCategory.name') }"
				    			 v-validate="'required'">
			      <small class="invalid-feedback">{{ errors.first('frmEditCategory.name') }}</small>
				  </div>
				  <div class="form-group">
				    <input type="text" class="form-control" placeholder="Enter type" name="type" 
				    			 v-model="modalInputEditCategory.type"
				    			 :class="{ 'is-invalid': errors.first('frmEditCategory.type') }"
									 v-validate="'required'">
						<small class="invalid-feedback">{{ errors.first('frmEditCategory.type') }}</small>
				  </div>
				  <div class="form-group">
				  	<textarea class="form-control" placeholder="Enter description" style="height: 150px" name="description" 
				  						v-model="modalInputEditCategory.description"
				    			 		:class="{ 'is-invalid': errors.first('frmEditCategory.description') }"
									 		v-validate="'required'"></textarea>
						<small class="invalid-feedback">{{ errors.first('frmEditCategory.description') }}</small>
				  </div>
				</div>
				<div slot="modal-footer" class="w-100 text-center">
				 	<button type="submit" class="btn btn-primary px-4 mr-2">Update</button>
				 	<button type="button" class="btn btn-default px-4" @click="modalEditCategory=false">Cancel</button>
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
			categories: {},
			catDtl: {},
			catClassActive: 0, // get id; this is just for setting the active class

			// modal
			modalAddCategory: false,
			modalInputAddCategory: {},
			modalEditCategory: false,
			modalInputEditCategory: {},
		}
	},
	created() {
		this.getCategories()
	},
	methods: {
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
            case 'frmAddCategory':   vm.addCategory();      	break
            case 'frmEditCategory':  vm.updateCategory();			break
            default: //
          }
        }
      })
    },

		/**
		 * Get all categories
		 */
		getCategories() {
			let vm = this
			axios
				.get('/api/promotioncategories', vm.requestedHeaders)
				.then(res => {
					vm.categories = res.data
					vm.getCategoryDetails(res.data[0]._id)
				})
		},

		/**
		 * Get Category Details
		 * 
		 * @param  ObjectId catId
		 */
		getCategoryDetails(catId) {
			let vm = this
			axios
				.get(`/api/promotioncategories/${catId}`, vm.requestedHeaders)
				.then(res => {
					vm.catDtl = res.data
					vm.catClassActive = catId
				})
		},

		/**
		 * Open modal
		 * 
		 * @param  String modal
		 * @param  Object data
		 * @param  Integer index
		 */
		openModal(modal, data, index) {
			let vm = this

			vm.errors.clear() // this will clear all error message

			switch(modal) {
				case 'AddCategory':
					vm.modalInputAddCategory = {}
					vm.modalAddCategory = true
					break
				case 'EditCategory':
					vm.modalInputEditCategory = {
						_id: data._id,
						name: data.name,
						type: data.type,
						description: data.description
					}
					vm.modalEditCategory = true
					break
				default: //
			}
		},

		/**
		 * Add Category
		 */
		addCategory() {
			let vm = this

    	axios
    		.post('/api/promotioncategories', vm.modalInputAddCategory, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'New category added!', 'success')
					vm.categories.unshift(res.data)
					vm.modalAddCategory = false
	    		vm.modalInputAddCategory = {}
	    	})
		},

		/**
		 * Update specific category
		 */
		updateCategory() {
			let vm = this;
    	axios
    		.put(`/api/promotioncategories/${vm.modalInputEditCategory._id}`, vm.modalInputEditCategory, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'Category updated!', 'success')
					vm.getCategories()
					vm.modalEditCategory = false
	    		vm.modalInputAddCategory = {}
	    	})
		},

		/**
		 * Remove Category
		 * 
		 * @param  Integer catId
		 */
		removeCategory(catId) {
			let vm = this
			if(confirm('You sure you want to remove this category?')) {
				axios
					.delete(`/api/promotioncategories/${catId}`, vm.requestedHeaders)
					.then(res => {
						vm.$swal('Success!', 'Category successfully removed!', 'success')
						vm.getCategories()
					})
			}
		}
	}
}
</script>
