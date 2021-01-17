<template>
  <div>
    <form @submit.prevent="formValidator('frmEditFee')" data-vv-scope="frmEditFee">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter amount" class="text-base text-right" name="amount" 
                v-model="editFeeData.amount"
                :class="{ 'border-dangerMsg': errors.first('frmEditFee.amount') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditFee.amount') }}</small>
      </div>

      <div class="text-center">
        <button class="btn px-6 py-3 mr-2 bg-primaryBtn text-white rounded-md">Update Fee</button>
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
    editFeeSuccess: Function,
    feeSelected: Object,
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
      editFeeData:  {}
  	}
  },
  created() {
    let vm = this
    vm.editFeeData = vm.feeSelected;
    console.log(vm.editFeeData);
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
					vm.updateFee()
				}
			})
    },

    /**
		 * Update
		 */
		updateFee() {
			let vm = this
      vm.toggleLoader(true);
      axios.put(`${process.env.VUE_APP_API_URL}/api/fees/${vm.editFeeData._id}`, { amount: vm.editFeeData.amount }, vm.requestedHeaders)
      .then(res => {
        vm.$swal('Success!', 'Fee updated!', 'success')
        res.data.__index = vm.editFeeData.__index;
        vm.editFeeSuccess(res.data, 'edit');
    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
