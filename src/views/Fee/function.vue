<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddFeeModal from './modals/AddFeeModal.vue'
	import EditFeeModal from './modals/EditFeeModal.vue'

	var Fee = {
		components:	{
			Header,
			AddFeeModal,
			EditFeeModal,
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
				feeArr: [],
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
				isShowAddFeeModal	: false,
				isShowEditFeeModal	: false,
				feeSelected: {},
			}
		},
		created() {
			this.getFees();
		},
		methods: {
			getFees(){
				let vm = this
				vm.loader.isShow = true;
				axios.get(`${process.env.VUE_APP_API_URL}/api/fees`, vm.requestedHeaders)
					.then(res => {
						this.feeArr = res.data;
						vm.loader.isShow = false;
					})
			},
			/**
			 * Delete
			 */
			deleteFee(data, index) {
				let vm = this
				vm.loader.isShow = true;
				if (confirm('Are you sure you want to remove ' + data.type + '?')) {
					axios.delete(`${process.env.VUE_APP_API_URL}/api/fees/${data._id}`, vm.requestedHeaders)
					.then(() => {
						vm.$swal('Success!', 'Fee Removed!', 'success')
						vm.feeArr.splice(index, 1)
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

			toggleFeeModals(opt, type, index, data)	{
				let vm = this
				vm.isShowAddFeeModal = type == 'add' ? opt : false;
				vm.isShowEditFeeModal = type == 'edit' ? opt : false;

				if(type == 'edit'){
					if(data){
						vm.feeSelected = data;
					}
					vm.feeSelected.__index = index;
				}
			},
			refreshData(data, type)	{
				let vm = this
				vm.isShowAddFeeModal = false;
				vm.isShowEditFeeModal = false;

				if(type == 'add'){
					vm.feeArr.push(data)
				}else{
					vm.feeArr[data.__index].amount = data.amount
				}
				vm.loader.isShow = false;
			},
    }
	}
	export default Fee
</script>