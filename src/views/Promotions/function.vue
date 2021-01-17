<script>
	import axios from 'axios';

	import { Header } from '../Header'
	import { Loader } from '../../components/Loader'
	import AddPromotionsModal from './modals/AddPromotionsModal.vue'
	import EditPromotionsModal from './modals/EditPromotionsModal.vue'

	var Promotions = {
		components:	{
			Header,
			AddPromotionsModal,
			EditPromotionsModal,
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
				isShowAddPromotions: false,
				isShowEditPromotions: false,
				promotionsArr: [],
				promotion: {},
				promotionSelected: {},
				activePromotionsId: null,
				loader:	{
					isShow: true,
					message: 'Preparing',
				},
			}
		},
		created() {
			this.getAllPromotions();
		},
		methods: {
			/**
			 * Show all promotions
			 */
			async getAllPromotions() {
				let vm = this
				vm.loader.isShow = true;
				await axios
					.get('/api/promotioncategories', vm.requestedHeaders)
					.then(async res => {
						vm.promotionsArr = res.data
						vm.selectPromotion(vm.promotionsArr[0], 0);
						vm.loader.isShow = false;
					})
			},
			togglePromotionModals(opt, type)	{
				let vm = this
				vm.isShowAddPromotions = type == 'add' ? opt : false;
				vm.isShowEditPromotions = type == 'edit' ? opt : false;

				if(type == 'edit'){
					console.log(vm.promotion.__index);
					vm.promotionSelected = {
						createdAt: vm.promotionsArr[vm.promotion.__index].createdAt,
						description: vm.promotionsArr[vm.promotion.__index].description,
						name: vm.promotionsArr[vm.promotion.__index].name,
						type: vm.promotionsArr[vm.promotion.__index].type,
						updatedAt: vm.promotionsArr[vm.promotion.__index].updatedAt,
						_id: vm.promotionsArr[vm.promotion.__index]._id,
						__index: vm.promotion.__index,
					};
				}
			},
			/**
			 * View promotion Content
			 * 
			 * @param  Obj data
			 */
			selectPromotion(data, index) {
				let vm = this
				vm.promotion = {
					createdAt: data.createdAt,
					description: data.description,
					name: data.name,
					type: data.type,
					updatedAt: data.updatedAt,
					_id: data._id,
					__index: index,
				};
				vm.activePromotionsId = data._id
			},

			refreshData(data, type)	{
				let vm = this
				vm.isShowAddPromotions = false;
				vm.isShowEditPromotions = false;

				if(type == 'add'){
					vm.promotionsArr.push(data)
				}else{
					vm.promotionsArr[data.__index] = data
					vm.promotion = data
				}
				vm.loader.isShow = false;
			},

			/**
			 * Remove promotion
			 */
			removePromotion() {
				let vm = this
				if (confirm ('Are you sure you want to remove this promotion?')) {
					vm.loader.isShow = true;
					axios
						.delete(`/api/promotioncategories/${vm.activePromotionsId}`, vm.requestedHeaders)
						.then((res) => {
							vm.$swal('Success!', 'Promotion removed!', 'success')
							vm.loader.isShow = false;
							vm.getAllPromotions(res)
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
	export default Promotions
</script>