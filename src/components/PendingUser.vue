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
							<td class="table-secondary">{{ userDetails.pekerjaan}}</td>
						</tr>
						<tr>
							<td class="table-info">Pendidikan</td>
							<td class="table-secondary">{{ userDetails.pendidikan }}</td>
						</tr>
						<tr>
							<td class="table-info">Penghasilan</td>
							<td class="table-secondary">{{ userDetails.penghasilan }}</td>
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
				<button class="btn btn-lg btn-secondary" @click="modalUserShow = false">Cancel</button>
			</div>
		</b-modal>
				<!-- <button class="btn btn-lg btn-success" @click="changeStatus(modalDataUser._id, modalDataUser.index)">Save</button> -->
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
				let parseImage = JSON.parse(res.data[0].ktp) // lol this, I need to parse???

				for (let x in parseImage) {
					if (x==='ktp') vm.userImageKtp = parseImage[x]
					if (x==='photo') vm.userImageProfile = parseImage[x]
				}
			})
		},

		/**
		 * This will add credits to the user then add him/her to the active users list
		 * 
		 * @param  {integer} id    User Id
		 * @param  {integer} index Index, Key
		 */
		/*changeStatus(id, index) {
			let vm = this
			let dataInput = {
				user_id: id,
				credit: vm.inputCredit
			}

			if (confirm("Assign credit?")) {
				axios.put(`${process.env.VUE_APP_API_URL}/users/${id}/assign-credit`, dataInput).then(() => {
					alert("Success")
					vm.users.splice(index, 1)
					vm.modalUserShow = false
				})
			}
		},*/

		/**
		 * Activate user
		 * 
		 * @param  int hp Phone Number
		 * @param  int index
		 */
		activate(hp, index) {
			let vm = this
			let dataInput = {
				credit: 0,
				activated: 2
			}
			if (confirm("Activate this account?")) {
				axios.post(`${process.env.VUE_APP_API_URL}/users/${hp}/assign-credit`, dataInput).then((res) => {
					alert("Successfully Activated!")
					vm.users.splice(index, 1)
					console.log(res.data)
				})
			}
		}
	}
}
</script>
