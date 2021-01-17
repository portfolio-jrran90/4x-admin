<template>
  <div>
    <form @submit.prevent="formValidator('frmAddCategory')" data-vv-scope="frmAddCategory">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter name" class="text-base" name="name" 
                v-model="addPromotionData.name"
                :class="{ 'border-dangerMsg': errors.first('frmAddCategory.name') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddCategory.name') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter type" class="text-base" name="type"
                v-model="addPromotionData.type"
                :class="{ 'border-dangerMsg': errors.first('frmAddCategory.type') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddCategory.type') }}</small>
      </div>
      <div class="input-div mb-5">
        <textarea cols="10" rows="6" placeholder="Enter description" class="text-base" style="resize: none;" name="description"
                v-model="addPromotionData.description"
                :class="{ 'border-dangerMsg': errors.first('frmAddCategory.description') }"
                v-validate="'required'"></textarea>
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddCategory.description') }}</small>
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
    addPromotionSuccess: Function,
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
					vm.addPromotion();
				}
			})
    },
    
    /**
		 * Save the template
		 */
		addPromotion() {
      let vm = this
      vm.toggleLoader(true);
    	axios
    		.post('/api/promotioncategories', vm.addPromotionData, vm.requestedHeaders)
    		.then(res => {
          vm.addPromotionSuccess(res.data, 'add');
					vm.$swal('Success!', 'New category added!', 'success')
	    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
