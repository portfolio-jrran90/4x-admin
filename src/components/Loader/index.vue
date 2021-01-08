<template>
	<div class="loader-container fixed w-full h-screen bg-blue-50 bg-opacity-50 z-50">
		<div class="flex items-center justify-center h-full">
			<div id="loader"></div>
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