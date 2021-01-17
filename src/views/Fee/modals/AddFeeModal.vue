<template>
  <div>
    <form @submit.prevent="formValidator('frmAddFee')" data-vv-scope="frmAddFee">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter type" class="text-base" name="type" 
                v-model="addFeeData.type"
                :class="{ 'border-dangerMsg': errors.first('frmAddFee.type') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddFee.type') }}</small>
      </div>
      <div class="input-div mb-5">
        <textarea cols="10" rows="6" placeholder="Enter description" class="text-base" style="resize: none;" name="description"
                v-model="addFeeData.description"
                :class="{ 'border-dangerMsg': errors.first('frmAddFee.description') }"
                v-validate="'required'"></textarea>
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddFee.description') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter amount" class="text-base text-right" name="amount" 
                v-model="addFeeData.amount"
                :class="{ 'border-dangerMsg': errors.first('frmAddFee.amount') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddFee.amount') }}</small>
      </div>

      <div class="text-center">
        <button @click="closeModal(false, 'add')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
        <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Add Fee</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    closeModal: Function,
    addFeeSuccess: Function,
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
      addFeeData: {},
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
					vm.addFee();
				}
			})
    },

    /**
		 * Save
		 */
		addFee() {
      let vm = this
      vm.toggleLoader(true);
      axios.post(`${process.env.VUE_APP_API_URL}/api/fees`, vm.addFeeData, vm.requestedHeaders )
      .then(res => {
        vm.$swal('Success!', 'Fee added!', 'success')
        vm.addFeeSuccess(res.data, 'add');
    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
