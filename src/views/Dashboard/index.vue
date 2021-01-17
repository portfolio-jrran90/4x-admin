<template>
	<div class="main-container">
		<Loader v-if="showLoader"/>
		<Header v-if="$route.name == 'UserVerificatonDetails'"/>

		<div class="main-content h-full">
			<div class="flex h-full">
				<Sidemenu v-if="$route.name != 'UserVerificatonDetails'"/>
				<div class="flex-1 h-full" >
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import Dashboard from './function.vue'
	export default Dashboard
</script>