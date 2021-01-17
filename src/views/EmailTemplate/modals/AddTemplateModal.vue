<template>
  <div>
    <form @submit.prevent="formValidator('frmAddTemplate')" data-vv-scope="frmAddTemplate">
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter type" class="text-base" name="type" 
                v-model="addTemplateData.type"
                :class="{ 'border-dangerMsg': errors.first('frmAddTemplate.type') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddTemplate.type') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter subject" class="text-base" name="subject"
                v-model="addTemplateData.subject"
                :class="{ 'border-dangerMsg': errors.first('frmAddTemplate.subject') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddTemplate.subject') }}</small>
      </div>
      <div class="input-div mb-5">
        <input type="text" placeholder="Enter image URL" class="text-base" name="image_url"
                v-model="addTemplateData.image_url"
                :class="{ 'border-dangerMsg': errors.first('frmAddTemplate.image_url') }"
                v-validate="'required'">
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddTemplate.image_url') }}</small>
      </div>
      <div class="input-div mb-5">
        <textarea cols="10" rows="6" placeholder="Enter content" class="text-base" style="resize: none;" name="content"
                v-model="addTemplateData.content"
                :class="{ 'border-dangerMsg': errors.first('frmAddTemplate.content') }"
                v-validate="'required'"></textarea>
        <small class="text-dangerMsg mt-2 block">{{ errors.first('frmAddTemplate.content') }}</small>
      </div>

      <div class="text-center">
        <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Add template</button>
        <button @click="closeModal(false, 'add')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    closeModal: Function,
    addTemplateSuccess: Function,
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
      addTemplateData:  {}
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
					vm.addTemplate();
				}
			})
    },
    
    /**
		 * Save the template
		 */
		addTemplate() {
      let vm = this
      vm.toggleLoader(true);
    	axios
    		.post('/api/templates', vm.addTemplateData, vm.requestedHeaders)
    		.then(res => {
          vm.addTemplateSuccess(res.data, 'add');
					vm.$swal('Success!', 'New template added!', 'success')
	    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
