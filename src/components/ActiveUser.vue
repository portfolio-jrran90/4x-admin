<template>

	<div>
		<h2>Active Users</h2>
		<div class="row">
			<div class="col-md-10">
				<table class="table table-hover table-striped">
					<thead>
						<tr class="d-flex">
							<th class="col-4">Name</th>
							<th class="col-3 text-right" style="text-align: right !important">Credits</th>
							<th class="col-3 text-right" style="text-align: right !important">Installment</th>
							<th class="col-2"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in users" class="d-flex">
							<td class="col-4">{{ `${data.firstname} ${data.lastname}` }}</td>
							<td class="col-3 text-right">
								{{ (data.transactions[0]) ? Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.transactions[0].initial_balance) : 0 }}
							</td>
							<td class="col-3 text-right">
								<a href @click.prevent="openModal('ItemizeInstallment', data)">
									{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.totAmt) }}
								</a>
							</td>
							<td class="col-2 text-center">
								<a href @click.prevent="openModal('UserDetail', data, index)">
									<i class="nc-icon nc-zoom-split"></i> View
								</a>
							</td>
						</tr>
						<tr v-if="users.length==0">
							<td colspan="4">No active user(s) found!</td>
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
					<div>
						<div class="form-group row">
							<label for="inputAssignCredit" class="col-sm-4 col-form-label">Assign Credit</label>
							<div class="col-sm-8">
								<input type="number" class="form-control text-right" id="inputAssignCredit" placeholder="0" v-model="inputCredit">
							</div>
						</div>
					</div>
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
				</div>
			</div>
			<div slot="modal-footer">
				<button class="btn btn-lg btn-secondary mr-2" @click="modalUserShow = false">Cancel</button>
				<button class="btn btn-lg btn-success" @click="topUpCredit(modalDataUser, modalDataUser.index)">Save</button>
			</div>
		</b-modal>

		<b-modal v-model="modalItemizeInstallent" size="lg">
			<div slot="modal-header">
				<h4>Installment</h4>
			</div>
			<div class="row">
				<div class="col-md-12">
					<table class="table table-striped table-hover">
						<thead>
							<tr>
								<th>Transaction No.</th>
								<th>Item Name</th>
								<th style="text-align: right !important">Installment Date</th>
								<th style="text-align: right !important">Amount</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="data in modalDataInstallment.transactions">
								<td>{{ data._id }}</td>
								<td>{{ data.item_name }}</td>
								<td class="text-right">{{ data.created_at | moment("YYYY-MM-D h:mm a") }}</td>
								<td class="text-right table-secondary">{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.amount) }}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr class="table-info">
								<th class="text-right" colspan="3">TOTAL AMOUNT</th>
								<th class="text-right">
									{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(modalDataInstallment.totAmt) }}
								</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			<div slot="modal-footer">
				<button class="btn btn-lg btn-secondary mr-2" @click="modalItemizeInstallent = false">Close</button>
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
			modalItemizeInstallent: false,
			users: {},
			modalDataUser: {},
			modalDataInstallment: {},
			inputCredit: 0
		}
	},
	created() {
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/admin/get-users?s=activated`).then(res => {
			vm.users = res.data
			// Compute total amount
			res.data.map(num => {
				let a = 0
				for (let i=0; i<num.transactions[0].transactions.length; i++) {
					a += parseFloat(num.transactions[0].transactions[i].amount)
				}
				Object.assign(num, {totAmt: a})
			})
		})
	},
	methods: {
		openModal(type, user, index) {
			let vm = this
			switch (type) {
				case "ItemizeInstallment":
					vm.modalItemizeInstallent = true
					vm.modalDataInstallment = {
						transactions: user.transactions[0].transactions,
						totAmt: user.totAmt
					}
					break
				case "UserDetail":
					vm.modalUserShow = true
					vm.modalDataUser = {
						index: index,
						_id: user._id,
						firstname: user.firstname,
						lastname: user.lastname,
						gender: user.gender,
						dob: user.dob,
						mobile: user.mobile,
						email: user.email,
						address: user.address,
						photo_identity_card: `${process.env.VUE_APP_API_URL}/${user.photo.identity_card}`,
						photo_holding_the_card: `${process.env.VUE_APP_API_URL}/${user.photo.holding_the_card}`,
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
					break
				default:
					alert('error!, contact administrator')
					break
			}
		},
		topUpCredit(data, index) {
			let vm = this
			let dataInput = {
				user_id: data._id,
				credit: vm.inputCredit
			}

			if (confirm("Assign credit?")) {
				axios.put(`${process.env.VUE_APP_API_URL}/users/${dataInput.user_id}/assign-credit`, dataInput).then(() => {
					alert("Credit Balance Updated!")
					vm.users[index].transactions[0].initial_balance = parseFloat(vm.users[index].transactions[0].initial_balance) + parseFloat(dataInput.credit)
					vm.modalUserShow = false
				})
			}
		}
	}
}
</script>
