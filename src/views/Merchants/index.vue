<template>
	<div class="merchants-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="merchants-content px-4 pb-4 overflow-y-auto max-h-96">
			<div class="card p-4 pt-8">
				<div class="text-right w-full">
					<button class="btn bg-successMsg text-white px-6 py-2 rounded-md text-sm mb-5" @click="toggleMerchantModals( true, 'add' )">
						<font-awesome-icon icon="plus" class="mr-2" /> Add Merchant
					</button>
				</div>

				<table class="w-full tbl-merchant">
					<thead>
						<tr>
							<th class="text-left p-4" colspan="2">Details</th>
							<th class="text-right p-4">Date registered</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(list) in merchantsArr" :key="list.index">
							<td class="w-32 py-4 px-4 border-t">
								<img :src="list.fImage || '/assets/img/no-image.svg'" :alt="list.name" class="rounded-50% w-full">
							</td>
							<td class="p-4 border-t">
								<div>
									<h4 class="mb-0 text-md mb-3">{{ list.name }}</h4>
									<p class="text-sm">
										{{ list.mobileNumber }}<br>
										{{ list.email }}<br>
										<a :href="list.website" target="_blank" class="cursor-pointer underline">Visit website</a>
									</p>
								</div>
							</td>
							<td class="p-4 border-t text-right"> 
								{{ list.createdAt | moment('DD/MM/YYYY') }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>	

		<Modal 
			v-model="isShowAddMerchants" 
			title="Add Merchant"
			modal-class="modal-wrapper"
		>
			<AddMerchantsModal :closeModal="toggleMerchantModals" :addMerchantSuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Merchants from './function.vue'
	export default Merchants
</script>