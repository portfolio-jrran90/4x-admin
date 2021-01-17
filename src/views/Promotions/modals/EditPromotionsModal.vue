<template>
  <div class="flex">
    <div class="flex-1">
      <form @submit.prevent="formValidator('frmEditCategory')" data-vv-scope="frmEditCategory">
        <div class="input-div mb-5">
          <input type="text" placeholder="Enter name" class="text-base" name="name"
                  v-model="editPromotionData.name"
                  :class="{ 'border-dangerMsg': errors.first('frmEditCategory.name') }"
                  v-validate="'required'">
          <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditCategory.name') }}</small>
        </div>
        <div class="input-div mb-5">
          <input type="text" placeholder="Enter type" class="text-base" name="type"
                  v-model="editPromotionData.type"
                  :class="{ 'border-dangerMsg': errors.first('frmEditCategory.type') }"
                  v-validate="'required'">
          <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditCategory.type') }}</small>
        </div>
        <div class="input-div mb-5">
          <textarea cols="10" rows="6" placeholder="Enter description" class="text-base" style="resize: none;" name="description"
                  v-model="editPromotionData.description"
                  :class="{ 'border-dangerMsg': errors.first('frmEditCategory.description') }"
                  v-validate="'required'"></textarea>
          <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditCategory.description') }}</small>
        </div>

        <div class="">
          <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Update</button>
          <button @click.prevent="closeModal(false, 'edit')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
        </div>
      </form>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    closeModal: Function,
    editPromotionSuccess: Function,
    promotion: Object,
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
      editPromotionData:  {}
  	}
  },
  created() {

    let vm = this
    vm.editPromotionData = vm.promotion;
    console.log(vm.editPromotionData);
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
					vm.updatePromotion()
				}
			})
    },
    
    /**
		 * Update specific template
		 */
		updatePromotion() {
      let vm = this
      vm.toggleLoader(true);
    	axios
    		.put(`/api/promotioncategories/${vm.editPromotionData._id}`, vm.editPromotionData, vm.requestedHeaders)
    		.then(res => {
          vm.$swal('Success!', 'Promotion updated!', 'success')
          res.data.__index = vm.editPromotionData.__index;
          vm.editPromotionSuccess(res.data, 'edit');
	    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
