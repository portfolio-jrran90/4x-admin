<template>
	<div class="user-management-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="user-management-content overflow-y-auto px-4 pb-4 ">
			<div class="card p-4 pt-6">
				<div>
					<button class="btn bg-successMsg text-white px-6 py-2 rounded-md text-sm mb-5" @click.prevent="toggleUserModals(true, 'add')">
						<font-awesome-icon icon="plus" class="mr-2" /> Add User
					</button>
				</div>
				<table class="w-full text-left">
					<thead>
						<tr >
							<th class="text-gray-600 pr-5 py-3">Username</th>
							<th class="text-gray-600 pr-5 py-3">Email</th>
							<th class="text-gray-600 pr-5 py-3 text-right">Role</th>
							<th class="pr-5 py-3"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(list, index) in usersArr" :key="list.index"> 
							<td class="pr-5 py-3 border-t">{{ list.username }}</td>
							<td class="pr-5 py-3 border-t">{{ list.email }}</td>
							<td class="pr-5 py-3 border-t text-right">
								<span v-for="role in list.roles" :key="role.index">{{ role }},</span>
							</td>
							<td class="pr-5 py-3 border-t text-right">
								<a href="#" class="mr-2" @click.prevent="toggleUserModals(true, 'edit', index, list)">
									<font-awesome-icon icon="edit" class="text-primaryMsg"/>
								</a>
								<a href="#" @click.prevent="deleteUser(list, index)">
									<font-awesome-icon icon="trash-alt" class="text-dangerMsg" />
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			
		</div>

		<Modal 
			v-model="isShowAddUserModal" 
			title="Add User"
			modal-class="modal-wrapper w-1/2 max-w-none"
		>
			<AddUserModal :closeModal="toggleUserModals" :addUserSuccess="refreshData" :toggleLoader="toggleLoader"/>
		</Modal>
		
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import UserManagement from './function.vue'
	export default UserManagement
</script>