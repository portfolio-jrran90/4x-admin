<template>
  <div>
    <form @submit.prevent="formValidator('frmAddSalary')" data-vv-scope="frmAddSalary">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter type" class="text-base" name="type" 
                v-model="addSalaryData.type"
                :class="{ 'border-dangerMsg': errors.first('frmAddSalary.type') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddSalary.type') }}</small>
      </div>
      <div class="input-div mb-5">
        <textarea cols="10" rows="6" placeholder="Enter description" class="text-base" style="resize: none;" name="description"
                v-model="addSalaryData.description"
                :class="{ 'border-dangerMsg': errors.first('frmAddSalary.description') }"
                v-validate="'required'"></textarea>
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddSalary.description') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter credit" class="text-base text-right" name="credit" 
                v-model="addSalaryData.credit"
                :class="{ 'border-dangerMsg': errors.first('frmAddSalary.credit') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddSalary.credit') }}</small>
      </div>

      <div class="text-center">
        <button @click.prevent="closeModal(false, 'add')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
        <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Add</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    closeModal: Function,
    addSalarySuccess: Function,
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
      addSalaryData: {},
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
					vm.addSalary();
				}
			})
    },

    /**
		 * Save
		 */
		addSalary() {
      let vm = this
      vm.toggleLoader(true);
      axios.post(`${process.env.VUE_APP_API_URL}/api/usersalary`, vm.addSalaryData, vm.requestedHeaders )
      .then(res => {
        vm.$swal('Success!', 'New Salary added!', 'success')
        vm.addFeeSuccess(res.data, 'add');
      })
      .catch(err => {
        vm.toggleLoader(false);
        vm.$swal('Error!', err.response.data.message, 'error')
      })
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
