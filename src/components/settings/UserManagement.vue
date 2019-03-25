<template>
	<div>
	  <ol class="breadcrumb">
	    <li class="breadcrumb-item">
	    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
	    </li>
	    <li class="breadcrumb-item active" aria-current="page">User Management</li>
	  </ol>
		<div class="row">
			<div class="col">
				<a href="#" @click.prevent="openModal('AddUser')" class="btn btn-success px-4">
					<font-awesome-icon icon="plus" /> Add User
				</a>
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th>Username</th>
							<th>E-mail</th>
							<th>Role</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="data in users">
							<td>{{ data.username }}</td>
							<td>{{ data.email }}</td>
							<td>
								<ul class="list-inline mb-0">
									<li class="list-inline-item" v-for="role in data.roles">{{ role }},</li>
								</ul>
							</td>
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
		<b-modal v-model="modalAddUser" title="Add User" hide-footer>
			<form data-vv-scope="frmAddUser" @submit.prevent="formValidator('frmAddUser')">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter firstname" name="firstname"
					    			 v-model="modalAddUserInput.firstName"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.firstname') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.firstname') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter lastname" name="lastname"
					    			 v-model="modalAddUserInput.lastName"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.lastname') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.lastname') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter display name" name="displayname"
					    			 v-model="modalAddUserInput.displayName"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.displayname') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.displayname') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="email" class="form-control" placeholder="Enter email" name="email"
					    			 v-model="modalAddUserInput.email"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.email') }"
					    			 v-validate="'required|email'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.email') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter username" name="username"
					    			 v-model="modalAddUserInput.username"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.username') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.username') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="password" class="form-control" placeholder="Enter password" name="password"
					    			 v-model="modalAddUserInput.password"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.password') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.password') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter mobile number" name="mobilenumber"
					    			 v-model="modalAddUserInput.mobileNumber"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.mobilenumber') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.mobilenumber') }}</small>
					  </div>
					</div>
					<div class="col">
						<h4>Roles</h4>
					  <div class="form-group">
					  	<small class="text-muted">Note: select at least 1 role</small>
					  	<select class="form-control" v-model="modalAddUserInputRoles" name="roles" style="height: auto"
					    			 :class="{ 'is-invalid': errors.first('frmAddUser.roles') }"
					    			 v-validate="'required'"
					    			 multiple>
					  		<option value="superadmin">Super Admin</option>
					  		<option value="finance">Finance</option>
					  		<option value="useradmin">User Admin</option>
					  	</select>
					    <small class="invalid-feedback">{{ errors.first('frmAddUser.roles') }}</small>
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
			modalAddUserInputRoles: [],

			users: {},
		}
	},
	created() {
		this.indexUser()
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
					vm.modalAddUserInputRoles = []
					vm.modalAddUser = true
					break
				default: //
			}
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
						case 'frmAddUser': 		vm.storeUser(); 		break
						// case 'frmEditUser': 	vm.updateTemplate();	break
						default: //
					}
				}
			})
		},

		/**
		 * Display all users
		 */
		indexUser() {
			axios.get(`${process.env.VUE_APP_API_URL}/api/admins`, {
				headers: {
					'Authorization': process.env.VUE_APP_AUTHORIZATION,
					'x-access-token': localStorage.getItem("auth_token")
				}
			}).then(res => this.users = res.data)
		},

		/**
		 * Store a user
		 */
		storeUser() {
			let vm = this
			axios.post(`${process.env.VUE_APP_API_URL}/api/admins`, Object.assign(vm.modalAddUserInput, {roles: vm.modalAddUserInputRoles}), {
				headers: {
					'Authorization': process.env.VUE_APP_AUTHORIZATION,
					'x-access-token': localStorage.getItem("auth_token")
				}
			}).then(res => {
				alert('Successfully Added!')
				vm.users.unshift(res.data)
				vm.modalAddUser = false
			})
		},
	}
}
</script>