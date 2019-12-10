<template>
	<div>

		<nav aria-label="breadcrumb">
		  <ol class="breadcrumb">
		    <li class="breadcrumb-item">
		    	<router-link :to="{ name: 'settings-index' }">Settings</router-link>
		    </li>
		    <li class="breadcrumb-item active" aria-current="page">Notification Template</li>
		  </ol>
		</nav>

		<div class="row">
			<div class="col-md-4">
				<table class="table table-hover tbl-template">
					<thead>
						<tr>
							<th colspan="2">
								Type
								<a href="#" @click.prevent="openModal('AddTemplate')" class="float-right">
									<font-awesome-icon icon="plus-square" size="lg" /> Add
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in templates" :class="{'table-active': data._id == activeTemplateId }">
							<td>
								<a href="#" @click.prevent="viewTemplateContent(data)" class="text-dark">{{ data.type }}</a>
							</td>
							<td class="text-right">
								<ul class="list-inline mb-0">
									<li class="list-inline-item">
										<a href="#"
											@click.prevent="openModal('EditTemplate', data, index)"
											v-b-tooltip.hover
											title="Edit">
											<font-awesome-icon icon="edit" />
										</a>
									</li>
									<li class="list-inline-item">
										<a href="#"
											@click.prevent="removeTemplate"
											v-b-tooltip.hover
											title="Delete"
											class="text-danger">
											<font-awesome-icon icon="trash-alt" />
										</a>
									</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col">
				<h4 class="text-center mb-3">Preview</h4>
				<ul class="list-unstyled">
					<li><strong>Subject:</strong> {{ template.subject }}</li>
					<li><strong>Content:</strong> {{ template.image_url }}</li>
				</ul>
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
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter subject" name="subject"
					    			 v-model="modalEditTemplateInput.subject"
					    			 :class="{ 'is-invalid': errors.first('frmEditTemplate.subject') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.subject') }}</small>
					  </div>
					  <div class="form-group">
					    <input type="url" class="form-control" placeholder="Enter image URL" name="image_url"
					    			 v-model="modalEditTemplateInput.image_url">
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
				// .get('/api/preapprovedtransactions?pending=true&status=0&pgResponse=false', vm.requestedHeaders)
				.then(res => {
					let notif = res.data.filter(data => data.type.substring(0, 5) == 'notif');
					vm.templates = notif
					vm.viewTemplateContent(notif[0])
				})
		},

		/**
		 * Open a modal
		 *
		 * @param  {[type]} type
		 * @param  {[type]} data 'Object of data'
		 */
		openModal(type, data, index) {
			let vm = this

			vm.$validator.reset()

			switch(type) {
				case 'AddTemplate':
					vm.modalAddTemplateInput = {}
					vm.modalAddTemplate = true
					break
				case 'EditTemplate':
					vm.modalEditTemplateInput = {
						type: data.type,
						content: data.content,
						subject: data.subject,
						image_url: data.image_url,
						__index: index
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
			vm.template = data
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
					vm.templates[vm.modalEditTemplateInput.__index] = res.data
					vm.template = res.data
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

<style lang="scss" scoped>
	textarea { resize: none }
	.tbl-template {
		ul { display: none }
		.table-active ul { display: block }
	}
</style>
