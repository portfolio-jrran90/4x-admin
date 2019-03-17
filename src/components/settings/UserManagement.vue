<template>
	<div>
	  <ol class="breadcrumb">
	    <li class="breadcrumb-item">
	    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
	    </li>
	    <li class="breadcrumb-item active" aria-current="page">User Management</li>
	  </ol>
		<div class="row">
			<div class="col-md-5">
				<a href="#" @click.prevent="openModal('AddUser')" class="btn btn-success px-4">
					<font-awesome-icon icon="plus" /> Add User
				</a>
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Role</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>User 1</td>
							<td>Staff</td>
							<td class="text-right">
								<a href="#" v-b-tooltip.hover title="Edit user" class="mr-2">
									<font-awesome-icon icon="edit" />
								</a>
								<a href="#" v-b-tooltip.hover title="Remove user">
									<font-awesome-icon icon="trash-alt" />
								</a>
							</td>
						</tr>
						<tr>
							<td>User 2</td>
							<td>Staff</td>
							<td class="text-right">
								<a href="#" v-b-tooltip.hover title="Edit user" class="mr-2">
									<font-awesome-icon icon="edit" />
								</a>
								<a href="#" v-b-tooltip.hover title="Remove user">
									<font-awesome-icon icon="trash-alt" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddUser" title="Add User" size="sm" hide-footer>
			<form data-vv-scope="frmAddUser">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter user" name="user"
					    			 v-model="modalAddUserInput.name">
					    <!-- <small class="invalid-feedback">{{ errors.first('frmAddUser.type') }}</small> -->
					  </div>
					  <div class="form-group">
					  	<select class="form-control" v-model="modalAddUserInput.role">
					  		<option value="">-- Assign a role</option>
					  		<option value="master">Master</option>
					  		<option value="staff">Staff</option>
					  		<option value="finance">Finance</option>
					  		<option value="support">Support</option>
					  	</select>
					    <!-- <small class="invalid-feedback">{{ errors.first('frmAddUser.amount') }}</small> -->
					  </div>
					</div>
				</div>
	      <div slot="modal-footer">
	        <button type="submit" class="btn btn-primary mr-2">Add user</button>
	        <button type="button"class="btn btn-secondary" @click="modalAddUser=false">Close</button>
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
			modalAddUser: false,
			modalAddUserInput: {},
		}
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
				case 'AddUser':
					vm.modalAddUserInput = {}
					vm.modalAddUserInput.role = ''
					vm.modalAddUser = true
					break
				default: //
			}
		},
	}
}
</script>