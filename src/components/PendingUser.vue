<template>

	<div>
		<h2>Pending Users</h2>
		<div class="row">
			<div class="col-md-6">
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th colspan="2">Phone Number</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in users">
							<td>{{ data.Hp }}</td>
							<td class="text-right">
								<ul class="list-inline m-0">
									<li class="list-inline-item">
										<a href @click.prevent="activate(data.Hp, index)">Approve</a>
									</li>
									<li class="list-inline-item">
										<a href @click.prevent="openModalUserDetails(data)">View details</a>
									</li>
								</ul>
							</td>
						</tr>
						<tr v-if="users.length===0">
							<td colspan="2">No Record found!</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<b-modal v-model="modalUserShow" size="lg">
			<div slot="modal-header">
				<h4>User Detail</h4>
			</div>
			<div class="row">
				<div class="col-md-8">
					<table class="table table-bordered table-sm">
						<tr>
							<td class="table-info">Alamat</td>
							<td class="table-secondary">{{ userDetails.alamat }}</td>
						</tr>
						<tr>
							<td class="table-info">E-mail</td>
							<td class="table-secondary">{{ userDetails.email }}</td>
						</tr>
						<tr>
							<td class="table-info">Name</td>
							<td class="table-secondary">{{ `${userDetails.fname} ${userDetails.lname}` }}</td>
						</tr>
						<tr>
							<td class="table-info">Tanggal Lahir</td>
							<td class="table-secondary"></td>
						</tr>
						<tr>
							<td class="table-info">No. KTP</td>
							<td class="table-secondary">{{ userDetails.idcard }}</td>
						</tr>
						<tr>
							<td class="table-info">Bidang Kerja</td>
							<td class="table-secondary"></td>
						</tr>
						<tr>
							<td class="table-info">Pekerjaan</td>
							<td class="table-secondary">{{ userDetailsPekerjaan }}</td>
						</tr>
						<tr>
							<td class="table-info">Pendidikan</td>
							<td class="table-secondary">{{ userDetails.pendidikan }}</td>
						</tr>
						<tr>
							<td class="table-info">Penghasilan</td>
							<td class="table-secondary">{{ userDetailsPenghasilan }}</td>
						</tr>
						<tr>
							<td class="table-info">No. NPWP</td>
							<td class="table-secondary">{{ userDetails.npwp }}</td>
						</tr>
						<tr>
							<td class="table-info">Email Verifikasi</td>
							<td class="table-secondary">{{ ((userDetails.emailverified==0)?'Belum':'Sudah') }}</td>
						</tr>
					</table>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<figure class="figure m-0">
								<img :src="userImageProfile" class="figure-img img-fluid rounded" alt="profile picture">
								<figcaption class="figure-caption">Profile Picture</figcaption>
							</figure>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<figure class="figure m-0">
								<img :src="userImageKtp" class="figure-img img-fluid rounded" alt="ktp">
								<figcaption class="figure-caption">KTP</figcaption>
							</figure>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<figure class="figure m-0">
								<img :src="userDetails.selfie" class="figure-img img-fluid rounded" alt="selfie with ktp">
								<figcaption class="figure-caption">Selfie with KTP</figcaption>
							</figure>
						</div>
					</div>
				</div>
			</div>
			<div slot="modal-footer">
				<button class="btn btn-lg btn-secondary" @click="modalUserShow = false">Close</button>
			</div>
		</b-modal>
	</div>

</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			modalUserShow: false,
			users: {},
			inputCredit: 0,
			userDetails: {},
			userImageProfile: '',
			userImageKtp: '',
			userImageSelfieWithKtp: '',
			userDetailsPekerjaan: '',
			userDetailsPenghasilan: '',
		}
	},
	created() {
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/users/pending`, {
			headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
		}).then(res => vm.users = res.data)
	},
	methods: {
		openModalUserDetails(user, index) {
			let vm = this

			// reset every time the modal is clicked
			vm.userDetails = {}
			vm.userImageKtp = ''
			vm.userImageProfile = ''
			vm.userImageSelfieWithKtp = ''

			vm.modalUserShow = true
			axios.get(`${process.env.VUE_APP_API_URL}/users/${user.Hp}`, {
				headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
			}).then(res => {
				vm.userDetails = res.data[0]

				// extract image
				let parseImage = JSON.parse(res.data[0].ktp) // lol this, I need to parse???
				for (let x in parseImage) {
					if (x==='ktp') vm.userImageKtp = parseImage[x]
					if (x==='photo') vm.userImageProfile = parseImage[x]
				}

				// extract value for pekerjaan
				let pekerjaanValue = ''
				switch(res.data[0].pekerjaan) {
					case "negeri": pekerjaanValue = "Pegawai Negeri Sipil"; break
					case "swasta": pekerjaanValue = "Karyawan Swasta"; break
					case "bumn": pekerjaanValue = "Karyawan BUMN"; break
					case "bumd": pekerjaanValue = "Karyawan BUMD"; break
					case "konstruksi": pekerjaanValue = "Karyawan Jasa Konstruksi"; break
					case "POLRI": pekerjaanValue = "Kepolisian RI"; break
					case "TNI": pekerjaanValue = "Tentara Nasional Indonesia"; break
					case "wiraswasta": pekerjaanValue = "Wiraswasta"; break
					default: alert('Pekerjaan not found!'); break
				}
				vm.userDetailsPekerjaan = pekerjaanValue

				// extract value for penghasilan
				let penghasilanValue = ''
				switch(res.data[0].penghasilan) {
					case "gol1": penghasilanValue = "< Rp. 3.500.000"; break
					case "gol2": penghasilanValue = "Rp. 3.500.000 - Rp 6.000.000"; break
					case "gol3": penghasilanValue = "Rp. 6.000.000 - Rp 8.000.000"; break
					case "gol4": penghasilanValue = "Rp. 8.000.000 - Rp 10.000.000"; break
					case "gol5": penghasilanValue = "Rp. 10.000.000 - Rp 12.000.000"; break
					case "gol6": penghasilanValue = "> Rp. 12.000.000"; break
					default: alert('Penghasilan not found!'); break
				}
				vm.userDetailsPenghasilan = penghasilanValue
			})
		},

		/**
		 * Activate user
		 * 
		 * @param  int hp Phone Number
		 * @param  int index
		 */
		activate(hp, index) {
			let vm = this
			if (confirm("Activate this account?")) {
				axios.post(`${process.env.VUE_APP_API_URL}/users/${hp}/activated`, { activated: 2 }).then((res) => {
					alert("Successfully Activated!")
					vm.users.splice(index, 1)
				})
			}
		}
	}
}
</script>
