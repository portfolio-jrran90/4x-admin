<template>
	<div class="header-container flex border-b items-center px-4 shadow-md bg-navColor">
		<div class="logo-wrapper h-full flex items-center py-4 mr-2">
			<img :src="'../assets/img/EmpatKali_Logo.png'" alt="" class="h-full">
			<!-- <span class="logo-text text-2xl font-black text-black">DevNotes</span> -->
		</div>
		<div class="flex-1">
			<p class="text-sm"><span class="font-bold">Verification</span> Dashboard</p>
		</div>
		<div class="flex flex-1 text-right items-center">
			<div class="flex-1">
				<p class="text-sm font-bold">Hi, Scarlett</p>
			</div>
			<div class="flex-none ml-5 user-img relative parent-toggle">
				<div @click="isShowUserProfileMenu = isShowUserProfileMenu ? false : true" class="flex items-center cursor-pointer">
					<div class="img-container flex-1 mr-3">
						<img :src="'../assets/img/sample-user-img.png'" class="h-8 rounded" alt="">
					</div>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
				<div v-if="isShowUserProfileMenu" class="user-drop-container absolute right-0 top-10">
					<div class="bg-white border rounded-md w-44">
						<div class="menu-item px-4 py-2 cursor-pointer text-sm text-left border-b">Profile</div>
						<div class="menu-item px-4 py-2 cursor-pointer text-sm text-left">Logout</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Header from './function.vue'
	export default Header
</script>