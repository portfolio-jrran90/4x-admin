<template>
  <div class="flex">
    <div class="flex-1 mr-10">
      <form @submit.prevent="formValidator('frmEditTemplate')" data-vv-scope="frmEditTemplate">
        <div class="input-div mb-5">
          <input type="text" placeholder="Enter subject" class="text-base" name="subject"
                  v-model="editTemplateData.subject"
                  :class="{ 'border-dangerMsg': errors.first('frmEditTemplate.subject') }"
                  v-validate="'required'">
          <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditTemplate.subject') }}</small>
        </div>
        <div class="input-div mb-5">
          <input type="text" placeholder="Enter image URL" class="text-base" name="image_url"
                  v-model="editTemplateData.image_url">
        </div>
        <div class="input-div mb-5">
          <textarea cols="10" rows="6" placeholder="Enter content" class="text-base" style="resize: none;" name="content"
                  v-model="editTemplateData.content"
                  :class="{ 'border-dangerMsg': errors.first('frmEditTemplate.content') }"
                  v-validate="'required'"></textarea>
          <small class="text-dangerMsg mt-2 block">{{ errors.first('frmEditTemplate.content') }}</small>
        </div>

        <div class="">
          <button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md">Update template</button>
          <button @click.prevent="closeModal(false, 'edit')" class="btn px-6 py-3 mx-1 bg-closeBtn text-white rounded-md">Close</button>
        </div>
      </form>
    </div>
    
    <div class="flex-1">
      <p class="text-2xl font-bold mb-4">Preview</p>

      <div v-html="(editTemplateData.content)?((editTemplateData.content.length>0)?editTemplateData.content:'---'):'---'"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    closeModal: Function,
    editTemplateSuccess: Function,
    template: Object,
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
      sampleContent:  `Sample`,
      editTemplateData:  {}
  	}
  },
  created() {

    let vm = this
    vm.editTemplateData = vm.template;
    console.log(vm.editTemplateData);
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
					vm.updateTemplate()
				}
			})
    },
    
    /**
		 * Update specific template
		 */
		updateTemplate() {
      let vm = this
      vm.toggleLoader(true);
    	axios
    		.put('/api/templates', vm.editTemplateData, vm.requestedHeaders)
    		.then(res => {
          vm.$swal('Success!', 'Template updated!', 'success')
          res.data.__index = vm.editTemplateData.__index;
          vm.editTemplateSuccess(res.data, 'edit');
	    	})
		},
  }
}
</script>

<style lang="scss" scoped>
  
</style>
