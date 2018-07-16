<template>

	<div>
		<h2>Pending Users</h2>
		<table class="table table-hover table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Mobile</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="data in users">
					<td>{{ `${data.firstname} ${data.lastname}` }}</td>
					<td>{{ data.mobile }}</td>
					<td>
						<a href @click.prevent="openModal(data)">
							<i class="nc-icon nc-zoom-split"></i> View
						</a>
					</td>
				</tr>
			</tbody>
		</table>

		<b-modal v-model="modalUserShow" size="lg">
			<div slot="modal-header">
				<h4>User Detail</h4>
			</div>
			<div class="row">
				<div class="col-md-8">
					<table class="table table-bordered table-sm">
						<tr>
							<td class="table-info">Name</td>
							<td class="table-secondary">{{ `${modalDataUser.firstname} ${modalDataUser.lastname}` }}</td>
						</tr>
						<tr>
							<td class="table-info">Gender</td>
							<td class="table-secondary">{{ modalDataUser.gender }}</td>
						</tr>
						<tr>
							<td class="table-info">Date of Birth</td>
							<td class="table-secondary">{{ modalDataUser.dob }}</td>
						</tr>
						<tr>
							<td class="table-info">Mobile No.</td>
							<td class="table-secondary">{{ modalDataUser.mobile }}</td>
						</tr>
						<tr>
							<td class="table-info">E-mail</td>
							<td class="table-secondary">{{ modalDataUser.email }}</td>
						</tr>
						<tr>
							<td class="table-info">Address</td>
							<td class="table-secondary">{{ modalDataUser.address }}</td>
						</tr>

						<tr><th class="table-success" colspan="2">Emergency Number</th></tr>

						<tr>
							<td class="table-info">Name</td>
							<td class="table-secondary">{{ modalDataUser.en_name }}</td>
						</tr>
						<tr>
							<td class="table-info">Emergency Contact</td>
							<td class="table-secondary">{{ modalDataUser.en_emergency_contact }}</td>
						</tr>
						<tr>
							<td class="table-info">Mobile No.</td>
							<td class="table-secondary">{{ modalDataUser.en_mobile_no }}</td>
						</tr>
						<tr>
							<td class="table-info">Income</td>
							<td class="table-secondary">{{ modalDataUser.en_income }}</td>
						</tr>

						<tr><th class="table-success" colspan="2">Personal Data</th></tr>

						<tr>
							<td class="table-info">Industry</td>
							<td class="table-secondary">{{ modalDataUser.pd_industry }}</td>
						</tr>
						<tr>
							<td class="table-info">Work</td>
							<td class="table-secondary">{{ modalDataUser.pd_work }}</td>
						</tr>
						<tr>
							<td class="table-info">Education</td>
							<td class="table-secondary">{{ modalDataUser.pd_education }}</td>
						</tr>
						<tr>
							<td class="table-info">Income</td>
							<td class="table-secondary">{{ modalDataUser.pd_income }}</td>
						</tr>
					</table>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<figure class="figure">
								<img :src="modalDataUser.photo_identity_card" class="figure-img img-fluid rounded" alt="identification card photo">
								<figcaption class="figure-caption">Picture of the Identification card</figcaption>
							</figure>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<figure class="figure">
								<img :src="modalDataUser.photo_holding_the_card" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
								<figcaption class="figure-caption">Picture holding the Identification card</figcaption>
							</figure>
						</div>
					</div>
					<button class="btn btn-lg btn-block btn-secondary" @click="modalUserShow = false">Close</button>
					<button class="btn btn-lg btn-block btn-success" @click="activate(modalDataUser._id)">Activate User</button>
				</div>
			</div>
			<div slot="modal-footer">
				<!--  -->
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
			modalDataUser: {}
		}
	},
	created() {
		let vm = this
		axios.get('http://127.0.0.1:8080/users?status=0').then(res => vm.users = res.data.data)
	},
	methods: {
		openModal(user) {
			let vm = this
			vm.modalUserShow = true
			vm.modalDataUser = {
				_id: user._id,
				firstname: user.firstname,
				lastname: user.lastname,
				gender: user.gender,
				dob: user.dob,
				mobile: user.mobile,
				email: user.email,
				address: user.address,
				photo_identity_card: `http://127.0.0.1:8080/${user.photo.identity_card}`,
				photo_holding_the_card: `http://127.0.0.1:8080/${user.photo.holding_the_card}`,
				// Emergency Number
				en_emergency_contact: ((user.emergency != undefined) ? user.emergency_number.emergency_contact : '---'),
				en_income: ((user.emergency != undefined) ? user.emergency_number.income : '---'),
				en_mobile_no: ((user.emergency != undefined) ? user.emergency_number.mobile_no : '---'),
				en_name: ((user.emergency != undefined) ? user.emergency_number.name : '---'),
				// Personal Data
				pd_industry: ((user.personal_data != undefined) ? user.personal_data.industry : '---'),
				pd_work: ((user.personal_data != undefined) ? user.personal_data.work : '---'),
				pd_education: ((user.personal_data != undefined) ? user.personal_data.education : '---'),
				pd_income: ((user.personal_data != undefined) ? user.personal_data.income : '---')
			}
		},
		activate(id) {
			if (confirm("You really want to activate this account?")) {
				axios.put(`http://127.0.0.1:8080/users/${id}/activate`, { status: true }).then(res => {
					alert(res.data.msg)
					this.modalUserShow = false
					axios.get('http://127.0.0.1:8080/users?status=0').then(res2 => vm.users = res2.data.data)
				})
			}
		}
	}
}
</script>
