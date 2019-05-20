<template>
	<div>
		<nav aria-label="breadcrumb">
		  <ol class="breadcrumb">
		    <li class="breadcrumb-item">
		    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
		    </li>
		    <li class="breadcrumb-item active" aria-current="page">Email Template</li>
		  </ol>
		</nav>
		<div class="row">
			<div class="col-md-4">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>
								Type
								<a href="#" @click.prevent="openModal('AddTemplate')" class="float-right">
									<font-awesome-icon icon="plus-square" size="lg" /> Add
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="data in templates" :class="{'table-active': data._id == activeTemplateId }">
							<td @click="viewTemplateContent(data)">{{ data.type }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-md-8">
				<h4 class="text-center mb-3">
					Preview
					<span class="float-right">
						<a href="#"
							@click.prevent="openModal('EditTemplate')"
							v-b-tooltip.hover title="Edit template">
							<font-awesome-icon icon="edit" class="mr-2" />
						</a>
						<a href="#"
							@click.prevent="removeTemplate"
							v-b-tooltip.hover title="Delete template" class="text-danger">
							<font-awesome-icon icon="trash-alt" />
						</a>
					</span>
				</h4>
				<div v-html="template.content"></div>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddTemplate" title="Add Template" hide-footer>
			<form @submit.prevent="formValidator('frmAddTemplate')" data-vv-scope="frmAddTemplate">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalAddTemplateInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmAddTemplate.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddTemplate.type') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter subject" name="subject" 
					    			 v-model="modalAddTemplateInput.subject"
					    			 :class="{ 'is-invalid': errors.first('frmAddTemplate.subject') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmAddTemplate.subject') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="url" class="form-control" placeholder="Enter image URL" name="image_url" 
					    			 v-model="modalAddTemplateInput.image_url"
					    			 :class="{ 'is-invalid': errors.first('frmAddTemplate.image_url') }"
					    			 v-validate="'required|url'">
					    <small class="invalid-feedback">{{ errors.first('frmAddTemplate.image_url') }}</small>
					  </div>
					  <div class="form-group">
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter content" style="height: 200px" name="content" 
					    					v-model="modalAddTemplateInput.content"
					    					:class="{ 'is-invalid': errors.first('frmAddTemplate.content') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmAddTemplate.content') }}</small>
					  </div>
					</div>
				</div>
	      <div slot="modal-footer" class="w-100 text-center">
	        <button type="submit" class="btn btn-primary px-4 mr-2">Add template</button>
	        <button type="button"class="btn btn-secondary px-4" @click="modalAddTemplate=false">Close</button>
	      </div>
      </form>
		</b-modal>

		<b-modal v-model="modalEditTemplate" title="Edit Template" size="90" hide-footer>
			<form @submit.prevent="formValidator('frmEditTemplate')" data-vv-scope="frmEditTemplate">
				<div class="row">
					<div class="col">
					  <!-- <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalEditTemplateInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmEditTemplate.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.type') }}</small>
					  </div> -->
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter subject" name="subject" 
					    			 v-model="modalEditTemplateInput.subject"
					    			 :class="{ 'is-invalid': errors.first('frmEditTemplate.subject') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.subject') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="url" class="form-control" placeholder="Enter image URL" name="image_url" 
					    			 v-model="modalEditTemplateInput.image_url"
					    			 :class="{ 'is-invalid': errors.first('frmEditTemplate.image_url') }"
					    			 v-validate="'required|url'">
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.image_url') }}</small>
					  </div>
					  <div class="form-group">
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter content" style="height: 300px" name="content" 
					    					v-model="modalEditTemplateInput.content"
					    					:class="{ 'is-invalid': errors.first('frmEditTemplate.content') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.content') }}</small>
					  </div>
					</div>
					<div class="col">
						<h4>Preview</h4>
						<div v-html="(modalEditTemplateInput.content)?((modalEditTemplateInput.content.length>0)?modalEditTemplateInput.content:'---'):'---'"></div>
					</div>
				</div>
	      <div slot="modal-footer">
	        <button type="submit" class="btn btn-primary px-4 mr-2">Update template</button>
	        <button type="button"class="btn btn-secondary px-4" @click="modalEditTemplate=false">Close</button>
	      </div>
      </form>
		</b-modal>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			requestedHeaders: {
				headers: {
					Authorization: process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token"),
				}				
			},
			templates: {},
			template: {},
			activeTemplateId: '',

			// add
			modalAddTemplate: false,
			modalAddTemplateInput: {},

			// edit
			modalEditTemplate: false,
			modalEditTemplateInput: {},
		}
	},
	created() {
		this.indexTemplate()
	},
	methods: {

		/**
		 * Show all templates
		 */
		indexTemplate() {
			let vm = this
			axios
				.get('/api/templates', vm.requestedHeaders)
				.then(res => {
					vm.templates = res.data
					vm.viewTemplateContent(res.data[0])
				})
		},

		/**
		 * Open a modal
		 * 
		 * @param  {[type]} type
		 * @param  {[type]} data 'Object of data'
		 */
		openModal(type, data) {
			let vm = this

			vm.$validator.reset()

			switch(type) {
				case 'AddTemplate':
					vm.modalAddTemplateInput = {}
					vm.modalAddTemplate = true
					break
				case 'EditTemplate':
					vm.modalEditTemplateInput = {
						type: vm.template.type,
						content: vm.template.content,
						subject: vm.template.subject,
						image_url: vm.template.image_url
					}
					vm.modalEditTemplate = true
					break
				default: //
			}
		},

		/**
		 * View Template Content
		 * 
		 * @param  Obj data
		 */
		viewTemplateContent(data) {
			let vm = this
			vm.template = {
				type: data.type,
				content: data.content,
				image_url: data.image_url,
				subject: data.subject
			}
			vm.activeTemplateId = data._id
		},

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
					switch (scope) {
						case 'frmAddTemplate': 		vm.addTemplate(); 		break
						case 'frmEditTemplate': 	vm.updateTemplate();	break
						default: //
					}
				}
			})
		},

		/**
		 * Save the template
		 */
		addTemplate() {
			let vm = this
    	axios
    		.post('/api/templates', vm.modalAddTemplateInput, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'New template added!', 'success')
					vm.templates.push(res.data)
					vm.modalAddTemplate = false
	    	})
		},

		/**
		 * Update specific template
		 */
		updateTemplate() {
			let vm = this
    	axios
    		.put('/api/templates', vm.modalEditTemplateInput, vm.requestedHeaders)
    		.then(res => {
					vm.$swal('Success!', 'Template updated!', 'success')
					// vm.templates.push(res.data)
					vm.indexTemplate()
					vm.modalEditTemplate = false
	    	})
		},

		/**
		 * Remove template
		 */
		removeTemplate() {
			let vm = this
			if (confirm ('Are you sure you want to remove this template?')) {
	    	axios
	    		.delete(`/api/templates/${vm.activeTemplateId}`, vm.requestedHeaders)
	    		.then(res => {
						vm.$swal('Success!', 'Template removed!', 'success')
						vm.indexTemplate()
		    	})
	    }
		}
	}
}
</script>

<style scoped>
	textarea {
		resize: none
	}	
</style>
