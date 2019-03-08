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
							<!-- <td rowspan="5" class="w-50">
								<h5 class="text-info">Merchants</h5>
								<ul>
									<li>123</li>
									<li>123</li>
									<li>123</li>
									<li>123</li>
									<li>123</li>
								</ul>
							</td> -->
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
		<b-modal v-model="modalAddCategory" title="Add Category" @ok="addCategory" size="sm" ok-title="Add" ref="frmAddCategory">
			<div>
			  <div class="form-group">
			    <input type="text" class="form-control" placeholder="Enter name" name="name" 
			    			 v-model="modalInputAddCategory.name"
			    			 :class="{ 'is-invalid': errors.first('name') }"
			    			 v-validate="'required'">
		      <small class="invalid-feedback">{{ errors.first('name') }}</small>
			  </div>
			  <div class="form-group">
			    <input type="text" class="form-control" placeholder="Enter type" name="type" 
			    			 v-model="modalInputAddCategory.type"
			    			 :class="{ 'is-invalid': errors.first('type') }"
								 v-validate="'required'">
					<small class="invalid-feedback">{{ errors.first('type') }}</small>
			  </div>
			  <div class="form-group mb-0">
			  	<textarea class="form-control" placeholder="Enter description" style="height: 150px" name="description" 
			  						v-model="modalInputAddCategory.description"
			    			 		:class="{ 'is-invalid': errors.first('description') }"
								 		v-validate="'required'"></textarea>
					<small class="invalid-feedback">{{ errors.first('description') }}</small>
			  </div>
			</div>
		</b-modal>

		<b-modal v-model="modalEditCategory" title="Update Category" @ok="updateCategory" size="sm" ok-title="Update">
			<div>
			  <div class="form-group">
			    <input type="text" class="form-control" placeholder="Enter name" name="name" 
			    			 v-model="modalInputEditCategory.name"
			    			 :class="{ 'is-invalid': errors.first('name') }"
			    			 v-validate="'required'">
		      <small class="invalid-feedback">{{ errors.first('name') }}</small>
			  </div>
			  <div class="form-group">
			    <input type="text" class="form-control" placeholder="Enter type" name="type" 
			    			 v-model="modalInputEditCategory.type"
			    			 :class="{ 'is-invalid': errors.first('type') }"
								 v-validate="'required'">
					<small class="invalid-feedback">{{ errors.first('type') }}</small>
			  </div>
			  <div class="form-group mb-0">
			  	<textarea class="form-control" placeholder="Enter description" style="height: 150px" name="description" 
			  						v-model="modalInputEditCategory.description"
			    			 		:class="{ 'is-invalid': errors.first('description') }"
								 		v-validate="'required'"></textarea>
					<small class="invalid-feedback">{{ errors.first('description') }}</small>
			  </div>
			</div>
		</b-modal>

	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
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
		 * Get all categories
		 */
		getCategories() {
			let vm = this
			axios.get(`${process.env.VUE_APP_API_URL}/api/promotioncategories`, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
			}).then(res => {
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
			axios.get(`${process.env.VUE_APP_API_URL}/api/promotioncategories/${catId}`, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
			}).then(res => {
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
		addCategory(e) {
			let vm = this
			e.preventDefault()

      vm.$validator.validate('vm.modalInputAddCategory.*').then((result) => {
        if (result) {
        	axios.post(`${process.env.VUE_APP_API_URL}/api/promotioncategories`, vm.modalInputAddCategory, {
			      headers: {
			        'Authorization': process.env.VUE_APP_AUTHORIZATION,
			        'x-access-token': localStorage.getItem("auth_token")
			      }
        	}).then(res => {
						alert('Category Added!')
						vm.categories.unshift(res.data)
						vm.modalAddCategory = false
        		vm.modalInputAddCategory = {}
        	})
          return;
        }
      })
		},

		/**
		 * Update specific category
		 */
		updateCategory(e) {
			let vm = this;
			e.preventDefault();

      vm.$validator.validate('vm.modalInputEditCategory.*').then((result) => {
        if (result) {
        	axios.put(`${process.env.VUE_APP_API_URL}/api/promotioncategories/${vm.modalInputEditCategory._id}`, vm.modalInputEditCategory, {
			      headers: {
			        'Authorization': process.env.VUE_APP_AUTHORIZATION,
			        'x-access-token': localStorage.getItem("auth_token")
			      }
        	}).then(res => {
						alert('Category Updated!')
						vm.getCategories()
						vm.modalEditCategory = false
        		vm.modalInputAddCategory = {}
        	})
          return
        }
      })
		},

		/**
		 * Remove Category
		 * 
		 * @param  Integer catId
		 */
		removeCategory(catId) {
			if(confirm('You sure you want to remove this category?')) {
				axios.delete(`${process.env.VUE_APP_API_URL}/api/promotioncategories/${catId}`, {
		      headers: {
		        'Authorization': process.env.VUE_APP_AUTHORIZATION,
		        'x-access-token': localStorage.getItem("auth_token")
		      }
				}).then(res => {
					alert('Successfully removed!')
					this.getCategories()
				})
			}
		}
	}
}
</script>

<style scoped>
	/*Note: use splice*/
</style>