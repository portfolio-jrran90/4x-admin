<template>
	<div class="settings-container">
		<Header/>

		<div class="settings-content p-4 flex">
			<router-link 
				tag="div" 
				exact-active-class="none" 
				class="card flex-1 cursor-pointer rounded-md px-3 py-8 text-center font-bold mr-4" 
				:to="{ name: 'Email Template'}"
			>
				<font-awesome-icon icon="envelope" class="mr-2" size="lg" />
					Email Template
			</router-link>
			<router-link 
				tag="div" 
				exact-active-class="none" 
				class="card flex-1 cursor-pointer rounded-md px-3 py-8 text-center font-bold mr-4" 
				:to="{ name: 'Fee'}"
			>
				<font-awesome-icon icon="coins" class="mr-2" size="lg" />
					Fee
			</router-link>
			<router-link 
				tag="div" 
				exact-active-class="none" 
				class="card flex-1 cursor-pointer rounded-md px-3 py-8 text-center font-bold mr-4" 
				:to="{ name: 'User Management'}"
			>
				<font-awesome-icon :icon="['fas', 'user-friends']" class="mr-2" size="lg" />
					User Management
			</router-link>
			<router-link 
				tag="div" 
				exact-active-class="none" 
				class="card flex-1 cursor-pointer rounded-md px-3 py-8 text-center font-bold mr-4" 
				:to="{ name: 'Salary'}"
			>
				<font-awesome-icon :icon="['fas', 'coins']" class="mr-2" size="lg" />
					Salary
			</router-link>
		</div>
		
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Settings from './function.vue'
	export default Settings
</script>