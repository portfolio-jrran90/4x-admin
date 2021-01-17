<template>
	<div class="change-limit-container">
		<Loader v-if="loader.isShow" :message="loader.message"/>
		<Header/>

		<div class="change-limit-content-container overflow-y-auto px-4 pb-4 ">
			<div class="card p-4 pt-6">
			
			</div>
		</div>

		
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import ChangeLimit from './function.vue'
	export default ChangeLimit
</script>