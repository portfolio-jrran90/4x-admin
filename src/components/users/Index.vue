<template>
	<div>
		<div class="row mb-3">
			<div class="col">
				<div class="form-inline">
				  <label class="my-1 mr-2" for="labelUserStatus">List of </label>
				  <select class="custom-select my-1 mr-sm-2" id="labelUserStatus" v-model="selectedUserStatus">
				    <option value="active">Active users</option>
				    <option value="pending">Pending users</option>
				    <option value="incomplete">Incomplete users</option>
				  </select>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<component :is="currentUserStatus"></component>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selectedUserStatus: 'active',
		}
	},
	computed: {
		currentUserStatus() {
			return this.selectedUserStatus + '-user'
		}
	}
}
</script>