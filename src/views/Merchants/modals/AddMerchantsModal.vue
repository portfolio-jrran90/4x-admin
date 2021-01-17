<template>
  <div>
    <form @submit.prevent="formValidator('frmAddMerchant')" data-vv-scope="frmAddMerchant">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter name" class="text-base" name="name" 
                v-model="addPromotionData.name"
                :class="{ 'border-dangerMsg': errors.first('frmAddMerchant.name') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddMerchant.name') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter username" class="text-base" name="username" 
                v-model="addPromotionData.username"
                :class="{ 'border-dangerMsg': errors.first('frmAddMerchant.username') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddMerchant.username') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter email" class="text-base" name="email" 
                v-model="addPromotionData.email"
                :class="{ 'border-dangerMsg': errors.first('frmAddMerchant.email') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddMerchant.email') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter mobile" class="text-base" name="mobile_no" 
                v-model="addPromotionData.mobileNumber"
                :class="{ 'border-dangerMsg': errors.first('frmAddMerchant.mobile_no') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddMerchant.mobile_no') }}</small>
      </div>

      <div class="text-center">
        <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Add</button>
        <button @click.prevent="closeModal(false, 'add')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    closeModal: Function,
    addMerchantSuccess: Function,
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
      addPromotionData:  {}
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
					vm.addMerchant();
				}
			})
    },
    
		addMerchant() {
      let vm = this
      vm.toggleLoader(true);
    	axios
    		.post('/api/merchants', vm.addPromotionData, vm.requestedHeaders)
    		.then(res => {
          vm.addMerchantSuccess(res.data, 'add');
					vm.$swal('Success!', 'New merchant added!', 'success')
	    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
