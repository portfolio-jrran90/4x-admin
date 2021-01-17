<template>
  <div>
    <form @submit.prevent="formValidator('frmAddUser')" data-vv-scope="frmAddUser">
      <div class="flex">
        <div class="flex-1 mr-3">
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter firstname" class="text-base" name="firstname" 
                    v-model="addUserData.firstName"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.firstname') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.firstname') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter lastname" class="text-base" name="lastname" 
                    v-model="addUserData.lastName"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.lastname') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.lastname') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter display name" class="text-base" name="displayname" 
                    v-model="addUserData.displayName"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.displayname') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.displayname') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter email" class="text-base" name="email" 
                    v-model="addUserData.email"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.email') }"
                    v-validate="'required|email'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.email') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter username" class="text-base" name="username" 
                    v-model="addUserData.username"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.username') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.username') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter password" class="text-base" name="password" 
                    v-model="addUserData.password"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.password') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.password') }}</small>
          </div>
          <div class="input-div mb-5">
            <input type="text" placeholder="Enter mobile number" class="text-base" name="mobilenumber" 
                    v-model="addUserData.mobileNumber"
                    :class="{ 'border-dangerMsg': errors.first('frmAddUser.mobilenumber') }"
                    v-validate="'required'">
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.mobilenumber') }}</small>
          </div>
          
          <div class="">
            <button @click="closeModal(false, 'add')" class="btn px-6 py-3 mr-1 bg-closeBtn text-white rounded-md">Close</button>
            <button class="btn px-6 py-3 ml-1 bg-primaryBtn text-white rounded-md">Add User</button>
          </div>
        </div>
        <div class="flex-1 ml-3">
          <h4 class="text-2xl mb-2">Roles</h4>
          <div class="input-div mb-5">
            <small class="text-md mb-3 block">Note: select at least 1 role</small>
            <select class="text-base" v-model="addUserInputRoles" name="roles" style="height: auto"
                    :class="{ 'is-invalid': errors.first('frmAddUser.roles') }"
                    v-validate="'required'"
                    multiple>
              <option value="superadmin">Super Admin</option>
              <option value="finance">Finance</option>
              <option value="useradmin">User Admin</option>
            </select>
            <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddUser.roles') }}</small>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    closeModal: Function,
    addUserSuccess: Function,
    toggleLoader: Function,
  },
  data() {
  	return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      addUserData: {},
      addUserInputRoles: [],
  	}
  },
  created() {
  },
  methods: {
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
					vm.addUser();
				}
			})
    },

    /**
		 * Save
		 */
		addUser() {
      let vm = this
      vm.toggleLoader(true);
      axios.post(`${process.env.VUE_APP_API_URL}/api/admins`, Object.assign(vm.addUserData, {roles: vm.addUserInputRoles}), vm.requestedHeaders)
      .then(res => {
        vm.toggleLoader(false);
        vm.$swal('Success!', 'User added!', 'success')
        vm.addUserSuccess(res.data, 'add');
			})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
