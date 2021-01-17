<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddMerchantsModal from './modals/AddMerchantsModal.vue'

	var Merchants = {
		components:	{
			Header,
			Loader,
			AddMerchantsModal,
		},
		data() {
			return {
				requestedHeaders: {
					headers: {
						Authorization: process.env.VUE_APP_AUTHORIZATION,
						'x-access-token': localStorage.getItem("auth_token")
					}
				},
				loader:	{
					isShow: false,
					message: 'Preparing',
				},
				isShowAddMerchants: false,
				merchantsArr: [],
			}
		},
		created() {
			this.getMerchants();
		},
		methods: {
			getMerchants(){
				let vm = this
				vm.loader.isShow = true;
				axios.get(`${process.env.VUE_APP_API_URL}/api/merchants`, vm.requestedHeaders)
					.then(res => {
						this.merchantsArr = res.data;
						vm.loader.isShow = false;
					})
			},
			/**
			 * Toggle Loader
			 */
			toggleLoader(opt){
				let vm = this
				vm.loader.isShow = opt;
			},

			toggleMerchantModals(opt, type)	{
				let vm = this
				vm.isShowAddMerchants = type == 'add' ? opt : false;
			},
			refreshData(data, type)	{
				let vm = this
				vm.isShowAddMerchants = false;

				if(type == 'add'){
					vm.merchantsArr.push(data)
				}
				vm.loader.isShow = false;
			},
    }
	}
	export default Merchants
</script>