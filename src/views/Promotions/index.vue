<template>
	<div class="promotions-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="promotions-content px-4 pb-4 overflow-y-auto max-h-96">
			<div class="card flex p-4 pt-8">
				<div class="flex-1">

					<div class="relative text-gray-600 pb-2 px-2">
						<span class="text-sm font-bold">Category</span>
						<a href="#" class="text-sm absolute top-0 right-2" @click="togglePromotionModals(true, 'add')">
							<font-awesome-icon icon="plus-square" class="mr-2" size="lg" /> Add
						</a>
					</div>

					<div class="scroll-container">
						<div 
							v-for="(list, index) in promotionsArr" 
							:key="list.index" 
							:class="{'bg-gray-100 border-l border-r': list._id == activePromotionsId }"
							class="relative text-gray-600 border-t px-2 py-3 cursor-pointer relative"
							@click.prevent="selectPromotion(list, index)"
						>
							<span class="text-base">{{ list.name }}</span>
						</div>
					</div>	

				</div>
				<div class="flex-2 pl-20 pb-20">
					<p class="text-xl font-bold mb-8">Details</p>

					<table class="w-full tbl-detail">
						<tbody>
							<tr>
								<td class="py-3 px-2 text-info">Name</td>
								<td class="py-3 px-2">{{ promotion.name }}</td>
							</tr>
							<tr>
								<td class="py-3 px-2 text-info">Description</td>
								<td class="py-3 px-2">{{ promotion.description }}</td>
							</tr>
							<tr>
								<td class="py-3 px-2 text-info">Type</td>
								<td class="py-3 px-2">{{ promotion.type }}</td>
							</tr>
							<tr>
								<td class="py-3 px-2 text-info">Date added</td>
								<td class="py-3 px-2">{{ promotion.createdAt | moment('DD/MM/YYYY') }}</td>
							</tr>
							<tr>
								<td class="py-3 px-2 text-info">Date updated</td>
								<td class="py-3 px-2">{{ promotion.updatedAt | moment('DD/MM/YYYY') }}</td>
							</tr>

							<tr>
								<td class="py-3 px-2 text-info" colspan="2">
									<button class="btn px-6 py-3 mx-1 bg-primaryBtn text-white rounded-md" @click="togglePromotionModals(true, 'edit')">Update</button>
        					<button class="btn px-6 py-3 mx-1 bg-dangerBtn text-white rounded-md" @click="removePromotion()">Remove</button>
								</td>
							</tr>
						</tbody>
					</table>

				</div>
			</div>
		</div>	

		<Modal 
			v-model="isShowAddPromotions" 
			title="Add Category"
			modal-class="modal-wrapper"
		>
			<AddPromotionsModal :closeModal="togglePromotionModals" :addPromotionSuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>

		<Modal 
			v-model="isShowEditPromotions" 
			title="Edit Category"
			modal-class="modal-wrapper"
		>
			<EditPromotionsModal :closeModal="togglePromotionModals" :editPromotionSuccess="refreshData" :promotion="promotionSelected" :toggleLoader="toggleLoader"/>
		</Modal>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Promotions from './function.vue'
	export default Promotions
</script>