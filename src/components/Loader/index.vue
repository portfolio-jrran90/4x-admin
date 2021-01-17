<template>
	<div class="loader-container fixed w-full h-screen top-0 left-0 bg-loader">
		<div class="flex items-center justify-center h-full">
			<!-- <div id="loader"></div> -->
			<div>
				<img :src="'../assets/img/EmpatKali-LG_Alternative.png'" class="w-40 block mx-auto">
				<!-- <img src="@/assets/logo.png" class="w-40 block mx-auto"> -->
				<span class="text-white text-2xl mt-4 font-bold block text-center">{{ message }} ...</span>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Loader from './function.vue'
	export default Loader
</script>