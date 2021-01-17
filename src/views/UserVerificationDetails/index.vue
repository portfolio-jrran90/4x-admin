<template>
	<div class="verification-details-container overflow-y-auto p-5">
		<div class="flex">
			<div class="card w-28 px-5 py-4 text-center mr-3 mb-3">
				<p class="text-sm font-bold mb-6">Score</p>
				<p class="text-3xl">0</p>
			</div>
			<div class="card flex flex-8 px-5 pt-4 pb-0 mr-3 mb-3">
				<div class="flex flex-col flex-1">
					<label class="flex-1 border-b text-sm font-bold pb-3 block">NIK</label>
					<p class="flex flex-3 items-center text-sm mt-0 pr-8">317500482642819</p>
				</div>
				<div class="flex flex-col flex-1">
					<label class="flex-1 border-b text-sm font-bold pb-3 block">Nama</label>
					<p class="flex flex-3 items-center text-sm mt-0 pr-8 ff-medium">Jeff Benzos</p>
				</div>
				<div class="flex flex-col flex-1">
					<label class="flex-1 border-b text-sm font-bold pb-3 block">Nomor HP</label>
					<p class="flex flex-3 items-center text-sm mt-0 pr-8">081199988777</p>
				</div>
				<div class="flex flex-col w-44">
					<label class="flex-1 border-b text-sm font-bold pb-3 block">Validasi KTP</label>
					<div class="flex flex-3 items-center pr-8">
						<button 
							class="btn text-white text-sm cursor-default ff-medium rounded-3xl py-2 px-4 bg-dangerMsg" 
						>
							<font-awesome-icon :icon="['fas', 'times']" class="mr-2" size="lg" />
							{{ 'No Record' }}
						</button>
					</div>
				</div>
				<div class="flex flex-col w-44">
					<label class="flex-1 border-b text-sm font-bold pb-3 block">Face Recognition</label>
					<div class="flex flex-3 items-center pr-8">
						<button 
							class="btn text-white text-sm cursor-default ff-medium rounded-3xl py-2 px-4 bg-successMsg" 
						>
							<font-awesome-icon :icon="['fas', 'check']" class="mr-2" size="lg" />
							{{ 'Pass' }}
						</button>
					</div>
				</div>
			</div>
			<div class="card flex w-60 p-5 mr-3 mb-3">
				<div v-viewer="{}" class="flex-1 mr-1">
					<img :src="'/assets/img/passport.png' || '/assets/img/no-image.png'" class="rounded-lg w-full border" alt="">
				</div>
				<div v-viewer="{}" class="flex-1 ml-1">
					<img :src="'/assets/img/passport.png' || '/assets/img/no-image.png'" class="rounded-lg w-full border" alt="">
				</div>
			</div>
			<div class="card w-40 px-5 py-4 mb-3">
				<p class="text-sm font-bold mb-5">Pengajuan</p>
				<div class="flex items-center mb-3">
					<div class="w-5 mr-4">
						<img :src="'../assets/img/calendar-icon.png'" class="w-full inline-block" alt="">
					</div>
					<div class="flex-1 text-sm">
						19 Agu 2020
					</div>
				</div>
				<div class="flex items-center">
					<div class="w-5 mr-4">
						<img :src="'../assets/img/clock-icon.png'" class="w-full inline-block" alt="">
					</div>
					<div class="flex-1 text-sm">
						14:59:09 WIB
					</div>
				</div>
			</div>
		</div>

		<div class="flex">
			<div class="card flex-1 px-4 py-4 mr-3 mb-3">
				<p class="text-base font-bold mb-4">Personal Information</p>
				<div class="flex mb-3">
					<label class="text-sm flex-1 text-gray-500">Email</label>
					<p class="text-sm flex-2"><span class="mr-3">:</span> {{ 'jeff@afterpay.com' }}</p>
				</div>
				<div class="flex mb-3">
					<label class="text-sm flex-1 text-gray-500">Nomor NPWP</label>
					<p class="text-sm flex-2"><span class="mr-3">:</span> {{ '99.999.999.9-999.999' }}</p>
				</div>
				<div class="flex mb-3">
					<label class="text-sm flex-1 text-gray-500">Penghasilan</label>
					<p class="text-sm flex-2"><span class="mr-3">:</span> {{ 'Lebih dari Rp20.000.000' }}</p>
				</div>
			</div>
			<div class="card w-64 px-4 py-4 mr-3 mb-3">
				<p class="text-base font-bold mb-4">NPWP</p>
				<div v-viewer="{}" class="w-full">
					<img :src="'/assets/img/full-passport.png' || '/assets/img/no-image.png'" class="rounded-lg w-full border" alt="">
				</div>
			</div>
			<div class="card w-64 px-4 py-4 mr-3 mb-3">
				<p class="text-base font-bold mb-4">Slip Gaji</p>
				<div v-viewer="{}" class="w-full">
					<img :src="'/assets/img/full-passport.png' || '/assets/img/no-image.png'" class="rounded-lg w-full border" alt="">
				</div>
			</div>
			<div class="card w-103 mb-3 relative">
				<p class="text-base font-bold absolute top-4 left-4">Location</p>
			</div>
		</div>

		<div class="flex">
			<div class="flex flex-col flex-1 mr-3">
				<div class="card flex-1 px-5 py-4 mb-3">
					<p class="text-base font-bold mb-7">Pengajuan Limit</p>

					<p class="text-2xl pb-3 mb-3 border-b">Rp5.000.000</p>

					<p class="text-sm font-bold mb-5">Riwayat Limit</p>

					<div class="flex mb-3">
						<label class="text-sm flex-1 text-gray-500">Limit Sekarang</label>
						<p class="text-sm flex-2"><span class="mr-3">:</span> {{ 'Rp2.000.000' }}</p>
					</div>
					<div class="flex mb-3">
						<label class="text-sm flex-1 text-gray-500">Outstanding</label>
						<p class="text-sm flex-2"><span class="mr-3">:</span> {{ 'Rp2.000.000' }}</p>
					</div>
					<div class="flex mb-3">
						<label class="text-sm flex-1 text-gray-500">Sisa Limit</label>
						<p class="text-sm flex-2"><span class="mr-3">:</span> {{ 'Rp2.000.000' }}</p>
					</div>
				</div>
				<div class="card px-5 py-4 mb-3 flex items-center">
					<p class="text-sm font-bold flex-1 mr-5">Komentar</p>
					<button class="btn flex-2 border-2 border-violet text-violet font-bold rounded-md py-2 px-4 h-10">Lihat</button>
				</div>
			</div>
			<div class="card w-110 px-5 py-4 mr-3 mb-3 relative">
				<p class="text-base font-bold mb-4 mr-5">Riwayat Pembelian</p>
				<a href="#" class="absolute text-xs font-bold top-5 right-5 text-violet">Lihat Detail</a>
				
				<table class="w-full text-left">
					<thead>
						<tr>
							<th class="text-sm font-bold border-b py-3">Nomor Transaksi</th>
							<th class="text-sm font-bold border-b py-3">1st</th>
							<th class="text-sm font-bold border-b py-3">2nd</th>
							<th class="text-sm font-bold border-b py-3">3rd</th>
							<th class="text-sm font-bold border-b py-3">4th</th>
							<th class="text-sm font-bold border-b py-3 text-right">Jumlah</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="list in 4" :key="list.index">
							<td class="border-b py-3">
								<p class="text-sm font-bold text-violet mb-1">DEUSE.14736591814771</p>
								<p class="text-xs text-gray-500">12 Okt 2020 23:59</p>
							</td>
							<td class="border-b py-3 min-w-11">
								<div class="bg-v-status-approved rounded-sm w-4 h-4"></div>
							</td>
							<td class="border-b py-3 min-w-11">
								<div class="bg-v-status-pending rounded-sm w-4 h-4"></div>
							</td>
							<td class="border-b py-3 min-w-11">
								<div class="bg-v-status-rejected rounded-sm w-4 h-4"></div>
							</td>
							<td class="border-b py-3 min-w-11">
								<div class="bg-v-status-none rounded-sm w-4 h-4"></div>
							</td>
							<td class="border-b py-3 text-right">
								<p class="text-sm">Rp850.000</p>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card w-103 px-5 py-4 mb-3">
				<div class="flex border-b pb-3 mb-3">
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Income</label>
						<p class="text-sm">Rp550.000.000</p>
					</div>
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Limit</label>
						<p class="text-sm">Rp550.000.000</p>
					</div>
				</div>

				<div class="flex mb-3">
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Total number of loan</label>
						<p class="text-sm">n/a</p>
					</div>
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Total amount of loan</label>
						<p class="text-sm">n/a</p>
					</div>
				</div>

				<div class="flex mb-3">
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Total paid</label>
						<p class="text-sm">n/a</p>
					</div>
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Total outstanding</label>
						<p class="text-sm">n/a</p>
					</div>
				</div>

				<div class="flex mb-3">
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Total default</label>
						<p class="text-sm">n/a</p>
					</div>
					<div class="flex-1">
						<label class="text-sm inline-block mb-2 text-gray-500">Current Capacity</label>
						<p class="text-sm">n/a</p>
					</div>
				</div>

				<div class="flex mb-3">
					<div class="flex-1">
						<label class="text-sm mb-4 text-gray-500">Default Rate</label>
						<p class="text-sm">n/a</p>
					</div>
					<div class="flex-1">
						<label class="text-sm mb-4 text-gray-500">Total default(6 Months)</label>
						<p class="text-sm">n/a</p>
					</div>
				</div>
				
				<div class="flex">
					<div class="flex-1">
						<label class="text-sm mb-4 text-gray-500">Max DPD</label>
						<p class="text-sm">n/a</p>
					</div>
					<div class="flex-1">
						<img :src="'../assets/img/afpi.png'">
					</div>
				</div>
			</div>
		</div>

		<div class="flex">
			<div class="card flex flex-1 items-center px-5 py-4">
				<div class="w-52">
					<button class="btn font-bold text-sm rounded-md py-2 px-4 h-10">
						<img :src="'../assets/img/blue-arrow-left.png'" class="w-8 mr-3 inline-block" alt="">
            Kembali ke list
					</button>
				</div>
				<div class="flex-1 text-right">
					<button class="btn bg-dangerBtn font-bold py-2 w-32 text-center text-base rounded-md ml-5 text-white">Rejected</button>
					<button class="btn bg-primaryBtn font-bold py-2 px-4 text-center text-base rounded-md ml-5 text-white">Approve dengan limit lain</button>
					<button class="btn bg-successBtn font-bold py-2 w-64 text-center text-base rounded-md ml-5 text-white">Approve</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import "./style.scss";
</style>

<script>
	import UserVerificationDetails from './function.vue'
	export default UserVerificationDetails
</script>