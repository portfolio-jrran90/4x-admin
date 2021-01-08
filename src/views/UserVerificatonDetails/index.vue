<template>
	<div class="verification-details-container p-5">
		<div class="flex">
			<div class="card px-4 py-3 text-center">
				<p class="text-ms font-bold">Score</p>
				<p class="text-lg">0</p>
			</div>
			<div class="card px-4 py-3 text-center">
				<p class="text-ms font-bold">Score</p>
				<p class="text-lg">0</p>
			</div>
			<div class="card px-4 py-3 text-center">
				<p class="text-ms font-bold">Score</p>
				<p class="text-lg">0</p>
			</div>
			<div class="card px-4 py-3 text-center">
				<p class="text-ms font-bold">Pengajuan</p>
				<div class="flex">
					<div class="icon">
						<!-- <img :src="''" alt=""> -->
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
	import UserVerificatonDetails from './function.vue'
	export default UserVerificatonDetails
</script>