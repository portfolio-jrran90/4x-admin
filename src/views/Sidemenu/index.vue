<template>
	<div class="sidemenu-container w-64 p-4 h-full shadow-lg bg-sidemenuColor">
		<div class="logo-wrapper h-10 mb-5">
			<img :src="'../assets/img/EmpatKali_Logo.png'" alt="" class="h-full">
		</div>
		<div class="mb-8">
			<p class="text-md"><span class="font-bold">Verification</span> Dashboard</p>
		</div>

		<div class="sidemenu-items">

			<div class="menu-item flex items-center px-4 py-5 cursor-pointer rounded-xl">
				<div class="icon-container w-7 mr-3">
					<img :src="'../assets/img/dashboard.png'" class="w-full" alt="">
				</div>
				<div class="flex-1">
					<p class="text-md ff-medium font-bold">Dashboard</p>
				</div>
			</div>

			<div class="menu-item-w-child sidemenu-user-toggle">
				<div @click="isShowUserChildMenu = isShowUserChildMenu ? false : true" class="menu-item flex items-center px-4 py-5 cursor-pointer rounded-xl">
					<div class="icon-container w-7 mr-3">
						<img :src="'../assets/img/users.png'" class="w-full" alt="">
					</div>
					<div class="flex-1">
						<p class="text-md ff-medium font-bold">Users</p>
					</div>
					<div class="flex-1 text-center">
						<svg v-if="!isShowUserChildMenu" xmlns="http://www.w3.org/2000/svg" class="w-4 text-gray-400 inline-block"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>

						<svg v-if="isShowUserChildMenu" xmlns="http://www.w3.org/2000/svg" class="w-4 text-gray-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
						</svg>
					</div>
				</div>

				<div v-if="isShowUserChildMenu" class="menu-child-items">
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Active</p>
					</div>
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Pending</p>
					</div>
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Incomplete</p>
					</div>
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Banned</p>
					</div>
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Freeze</p>
					</div>
					<div class="child-item p-4 rounded bg-sidemenuActiveColor mb-1 cursor-pointer">
						<p class="text-md ff-medium font-bold">Rejected</p>
					</div>
				</div>
			</div>

			<router-link 
				:to="{ name: 'Change Limit'}" 
				class="w-full rounded-xl inline-block"
				v-bind:class="{
					'bg-sidemenuActiveColor' : $route.name == 'Change Limit'
				}"
			>
				<div class="menu-item flex items-center px-4 py-5">
					<div class="icon-container w-7 mr-3">
						<img :src="'../assets/img/change-limit.png'" class="w-full" alt="">
					</div>
					<div class="flex-1">
						<p class="text-md ff-medium font-bold">Change Limit</p>
					</div>
				</div>
			</router-link>

			<router-link 
				:to="{ name: 'Settings'}" 
				class="w-full rounded-xl inline-block"
				v-bind:class="{
					'bg-sidemenuActiveColor' : $route.name == 'Email Template'
				}"
			>
				<div class="menu-item flex items-center px-4 py-5">
					<div class="icon-container w-7 mr-3">
						<img :src="'../assets/img/settings.png'" class="w-full" alt="">
					</div>
					<div class="flex-1">
						<p class="text-md ff-medium font-bold">Settings</p>
					</div>
				</div>
			</router-link>

		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Sidemenu from './function.vue'
	export default Sidemenu
</script>