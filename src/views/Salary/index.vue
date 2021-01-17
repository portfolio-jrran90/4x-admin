<template>
	<div class="salary-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="salary-content-container overflow-y-auto px-4 pb-4 ">
			<div class="card p-4 pt-6">
				<div>
					<button class="btn bg-successMsg text-white px-6 py-2 rounded-md text-sm mb-5" @click.prevent="toggleSalaryModals(true, 'add')">
						<font-awesome-icon icon="plus" class="mr-2" /> Add Salary
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
						<tr v-for="(list, index) in salaryArr" :key="list.index"> 
							<td class="pr-5 py-3 border-t">{{ list.type }}</td>
							<td class="pr-5 py-3 border-t">{{ list.description }}</td>
							<td class="pr-5 py-3 border-t text-right">{{ list.credit | currency }}</td>
							<td class="pr-5 py-3 border-t text-right">
								<a href="#" class="mr-2" @click.prevent="toggleSalaryModals(true, 'edit', index, list)">
									<font-awesome-icon icon="edit" class="text-primaryMsg"/>
								</a>
								<a href="#" @click.prevent="deleteSalary(list, index)">
									<font-awesome-icon icon="trash-alt" class="text-dangerMsg" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<Modal 
			v-model="isShowAddSalaryModal" 
			title="Add Salary"
			modal-class="modal-wrapper "
		>
			<AddSalaryModal :closeModal="toggleSalaryModals" :addSalarySuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>

		<Modal 
			v-model="isShowEditSalaryModal" 
			title="Edit Salary"
			modal-class="modal-wrapper w-80"
		>
			<EditSalaryModal :closeModal="toggleSalaryModals" :editSalarySuccess="refreshData" :salarySelected="salarySelected" :toggleLoader="toggleLoader"/>
		</Modal>
		
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Salary from './function.vue'
	export default Salary
</script>