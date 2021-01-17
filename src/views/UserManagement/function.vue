<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddUserModal from './modals/AddUserModal.vue'
	// import EditFeeModal from './modals/EditFeeModal.vue'

	var UserManagement = {
		components:	{
			Header,
			AddUserModal,
			// EditFeeModal,
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
				usersArr: [],
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
				isShowAddUserModal: false,
			}
		},
		created() {
			this.getUsers();
		},
		methods: {
			getUsers(){
				let vm = this
				vm.loader.isShow = true;
				axios.get(`${process.env.VUE_APP_API_URL}/api/admins`, vm.requestedHeaders)
					.then(res => {
						this.usersArr = res.data;
						vm.loader.isShow = false;
					})
					.catch(err => {
						vm.loader.isShow = false;
						console.log(err.response);
					});
			},
			/**
			 * Delete
			 */
			deleteUser(data, index) {
				console.log(data);
				console.log(index);
			},

			toggleUserModals(opt, type)	{
				let vm = this
				vm.isShowAddUserModal = type == 'add' ? opt : false;
			},

			/**
			 * Toggle Loader
			 */
			toggleLoader(opt){
				let vm = this
				vm.loader.isShow = opt;
			},

			refreshData(data, type)	{
				let vm = this
				vm.isShowAddUserModal = false;

				if(type == 'add'){
					vm.feeArr.push(data)
				}
				vm.loader.isShow = false;
			},
    }
	}
	export default UserManagement
</script>