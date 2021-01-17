<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddSalaryModal from './modals/AddSalaryModal.vue'
	import EditSalaryModal from './modals/EditSalaryModal.vue'

	var Salary = {
		components:	{
			Header,
			AddSalaryModal,
			EditSalaryModal,
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
				salaryArr: [],
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
				isShowAddSalaryModal	: false,
				isShowEditSalaryModal	: false,
				salarySelected: {},
			}
		},
		created() {
			this.getSalary();
		},
		methods: {
			getSalary(){
				let vm = this
				vm.loader.isShow = true;
				axios.get(`${process.env.VUE_APP_API_URL}/api/usersalary`, vm.requestedHeaders)
					.then(res => {
						this.salaryArr = res.data;
						vm.loader.isShow = false;
					})
			},
			/**
			 * Delete
			 */
			deleteSalary(data, index) {
				let vm = this
				vm.loader.isShow = true;
				if (confirm('Are you sure you want to remove ' + data.type + '?')) {
					axios.delete(`${process.env.VUE_APP_API_URL}/api/usersalary/${data._id}`, vm.requestedHeaders)
					.then(() => {
						vm.$swal('Success!', 'Salary Removed!', 'success')
						vm.salaryArr.splice(index, 1)
						vm.loader.isShow = false;
					})
				}
			},

			/**
			 * Toggle Loader
			 */
			toggleLoader(opt){
				let vm = this
				vm.loader.isShow = opt;
			},

			toggleSalaryModals(opt, type, index, data)	{
				let vm = this
				vm.isShowAddSalaryModal = type == 'add' ? opt : false;
				vm.isShowEditSalaryModal = type == 'edit' ? opt : false;

				if(type == 'edit'){
					if(data){
						vm.salarySelected = data;
					}
					vm.salarySelected.__index = index;
				}
			},
			refreshData(data, type)	{
				let vm = this
				vm.isShowAddSalaryModal = false;
				vm.isShowEditSalaryModal = false;

				if(type == 'add'){
					vm.salaryArr.push(data)
				}else{
					vm.salaryArr[data.__index].type = data.type
					vm.salaryArr[data.__index].description = data.description
					vm.salaryArr[data.__index].credit = data.credit
				}
				vm.loader.isShow = false;
			},
    }
	}
	export default Salary
</script>