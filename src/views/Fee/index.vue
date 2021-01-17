<template>
	<div class="fee-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="fee-content-container overflow-y-auto px-4 pb-4 ">
			<div class="card p-4 pt-6">
				<div>
					<button class="btn bg-successMsg text-white px-6 py-2 rounded-md text-sm mb-5" @click.prevent="toggleFeeModals(true, 'add')">
						<font-awesome-icon icon="plus" class="mr-2" /> Add Fee
					</button>
				</div>
				<table class="w-full text-left">
					<thead>
						<tr >
							<th class="text-gray-600 pr-5 py-3">Type</th>
							<th class="text-gray-600 pr-5 py-3">Description</th>
							<th class="text-gray-600 pr-5 py-3 text-right">Amount</th>
							<th class="pr-5 py-3"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(list, index) in feeArr" :key="list.index"> 
							<td class="pr-5 py-3 border-t">{{ list.type }}</td>
							<td class="pr-5 py-3 border-t">{{ list.description }}</td>
							<td class="pr-5 py-3 border-t text-right">{{ list.amount | currency }}</td>
							<td class="pr-5 py-3 border-t text-right">
								<a href="#" class="mr-2" @click.prevent="toggleFeeModals(true, 'edit', index, list)">
									<font-awesome-icon icon="edit" class="text-primaryMsg"/>
								</a>
								<a href="#" @click.prevent="deleteFee(list, index)">
									<font-awesome-icon icon="trash-alt" class="text-dangerMsg" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<Modal 
			v-model="isShowAddFeeModal" 
			title="Add Fee"
			modal-class="modal-wrapper"
		>
			<AddFeeModal :closeModal="toggleFeeModals" :addFeeSuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>

		<Modal 
			v-model="isShowEditFeeModal" 
			title="Edit Fee"
			modal-class="modal-wrapper w-80"
		>
			<EditFeeModal :closeModal="toggleFeeModals" :editFeeSuccess="refreshData" :feeSelected="feeSelected" :toggleLoader="toggleLoader"/>
		</Modal>
		
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Fee from './function.vue'
	export default Fee
</script>