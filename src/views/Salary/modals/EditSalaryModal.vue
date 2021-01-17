<template>
  <div>
    <form @submit.prevent="formValidator('frmEditSalary')" data-vv-scope="frmEditSalary">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter type" class="text-base" name="type" 
                v-model="editSalaryData.type"
                :class="{ 'border-dangerMsg': errors.first('frmEditSalary.type') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditSalary.type') }}</small>
      </div>
      <div class="input-div mb-5">
        <textarea cols="10" rows="6" placeholder="Enter description" class="text-base" style="resize: none;" name="description"
                v-model="editSalaryData.description"
                :class="{ 'border-dangerMsg': errors.first('frmEditSalary.description') }"
                v-validate="'required'"></textarea>
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditSalary.description') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter credit" class="text-base text-right" name="credit" 
                v-model="editSalaryData.credit"
                :class="{ 'border-dangerMsg': errors.first('frmEditSalary.credit') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditSalary.credit') }}</small>
      </div>


      <div class="text-center">
        <button class="btn px-6 py-3 mr-2 bg-primaryBtn text-white rounded-md">Update Salary</button>
        <button @click.prevent="closeModal(false, 'edit')" class="btn px-6 py-3 mr-2 bg-closeBtn text-white rounded-md">Close</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    closeModal: Function,
    editSalarySuccess: Function,
    salarySelected: Object,
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
      editSalaryData:  {}
  	}
  },
  created() {
    let vm = this
    vm.editSalaryData = vm.salarySelected;
    console.log(vm.editSalaryData);
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
					vm.updateSalary()
				}
			})
    },

    /**
		 * Update
		 */
		updateSalary() {
			let vm = this
      vm.toggleLoader(true);
      axios.put(`${process.env.VUE_APP_API_URL}/api/usersalary/${vm.editSalaryData._id}`, vm.editSalaryData, vm.requestedHeaders)
      .then(res => {
        vm.$swal('Success!', 'Salary updated!', 'success')
        res.data.__index = vm.editSalaryData.__index;
        vm.editSalarySuccess(res.data, 'edit');
    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
