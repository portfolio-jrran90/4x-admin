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
					Preview <a href="#" @click.prevent="openModal('EditTemplate')"><font-awesome-icon icon="edit" class="mr-2" /></a>
				</h4>
				<div v-html="template.content"></div>
			</div>
		</div>

		<!-- Modal -->
		<b-modal v-model="modalAddTemplate" title="Add Template" size="lg" hide-footer>
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
					    <textarea cols="30" rows="10" class="form-control" placeholder="Enter content" style="height: 200px" name="content" 
					    					v-model="modalAddTemplateInput.content"
					    					:class="{ 'is-invalid': errors.first('frmAddTemplate.content') }"
					    					v-validate="'required'"></textarea>
					    <small class="invalid-feedback">{{ errors.first('frmAddTemplate.content') }}</small>
					  </div>
					</div>
					<div class="col">
						<h4>Preview</h4>
						<div v-html="(modalAddTemplateInput.content)?((modalAddTemplateInput.content.length>0)?modalAddTemplateInput.content:'---'):'---'"></div>
					</div>
				</div>
	      <div slot="modal-footer">
	        <button type="button"class="btn btn-secondary mr-2" @click="modalAddTemplate=false">Close</button>
	        <button type="submit" class="btn btn-primary">Add template</button>
	      </div>
      </form>
		</b-modal>

		<b-modal v-model="modalEditTemplate" title="Edit Template" size="90" hide-footer>
			<form @submit.prevent="formValidator('frmEditTemplate')" data-vv-scope="frmEditTemplate">
				<div class="row">
					<div class="col">
					  <div class="form-group">
					    <input type="text" class="form-control" placeholder="Enter type" name="type" 
					    			 v-model="modalEditTemplateInput.type"
					    			 :class="{ 'is-invalid': errors.first('frmEditTemplate.type') }"
					    			 v-validate="'required'">
					    <small class="invalid-feedback">{{ errors.first('frmEditTemplate.type') }}</small>
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
	        <button type="button"class="btn btn-secondary mr-2" @click="modalEditTemplate=false">Close</button>
	        <button type="submit" class="btn btn-primary">Update template</button>
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
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/api/templates`, {
			headers: {
				'Authorization': process.env.VUE_APP_AUTHORIZATION,
        'x-access-token': localStorage.getItem("auth_token"),
			}
		}).then(res => {
			vm.templates = res.data
			vm.viewTemplateContent(res.data[0])
		})
	},
	methods: {
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
						content: vm.template.content
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
				content: data.content
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

    	axios.post(`${process.env.VUE_APP_API_URL}/api/templates`, vm.modalAddTemplateInput, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
    	}).then(res => {
				alert('Template Added!')
				vm.templates.push(res.data)
				vm.modalAddTemplate = false
    	})
		},

		/**
		 * Update specific template
		 */
		updateTemplate() {
			let vm = this

    	axios.put(`${process.env.VUE_APP_API_URL}/api/templates`, vm.modalEditTemplateInput, {
	      headers: {
	        'Authorization': process.env.VUE_APP_AUTHORIZATION,
	        'x-access-token': localStorage.getItem("auth_token")
	      }
    	}).then(res => {
				alert('Template Updated!')
				// vm.templates.push(res.data)
				vm.modalEditTemplate = false
    	})
		}
	}
}
</script>