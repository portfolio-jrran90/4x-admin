<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddTemplateModal from './modals/AddTemplateModal.vue'
	import EditTemplateModal from './modals/EditTemplateModal.vue'

	var EmailTemplate = {
		components:	{
			Header,
			AddTemplateModal,
			EditTemplateModal,
			Loader,
		},
		data() {
			return {
				requestedHeaders: {
					headers: {
						Authorization: process.env.VUE_APP_AUTHORIZATION,
						'x-access-token': localStorage.getItem("auth_token")
					}
				},
				isShowAddTemplate: false,
				isShowEditTemplate: false,
				templatesArr: [],
				template: {},
				activeTemplateId: null,
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
			}
		},
		created() {
			this.getAllTemplates();
		},
		methods: {
			/**
			 * Show all templates
			 */
			getAllTemplates() {
				let vm = this
				vm.loader.isShow = true;
				axios
					.get('/api/templates', vm.requestedHeaders)
					.then(res => {
						vm.templatesArr = res.data
						vm.selectTemplate(res.data[0])
						vm.loader.isShow = false;
					})
			},
			toggleTemplateModals(opt, type, index)	{
				let vm = this
				vm.isShowAddTemplate = type == 'add' ? opt : false;
				vm.isShowEditTemplate = type == 'edit' ? opt : false;

				if(type == 'edit'){
					vm.template.__index = index;
				}
			},
			/**
			 * View Template Content
			 * 
			 * @param  Obj data
			 */
			selectTemplate(data) {
				let vm = this
				vm.template = data
				vm.activeTemplateId = data._id
			},

			refreshData(data, type)	{
				let vm = this
				vm.isShowAddTemplate = false;
				vm.isShowEditTemplate = false;

				if(type == 'add'){
					vm.templatesArr.push(data)
				}else{
					vm.templatesArr[data.__index] = data
					vm.template = data
				}
				vm.loader.isShow = false;
			},

			/**
			 * Remove template
			 */
			removeTemplate() {
				let vm = this
				if (confirm ('Are you sure you want to remove this template?')) {
					vm.loader.isShow = true;
					axios
						.delete(`/api/templates/${vm.activeTemplateId}`, vm.requestedHeaders)
						.then((res) => {
							vm.$swal('Success!', 'Template removed!', 'success')
							vm.loader.isShow = false;
							vm.getAllTemplates(res)
						})
				}
			},

			/**
			 * Toggle Loader
			 */
			toggleLoader(opt){
				let vm = this
				vm.loader.isShow = opt;
			}
    }
	}
	export default EmailTemplate
</script>