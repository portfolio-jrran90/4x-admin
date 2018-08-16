<template>
	<div>
		<h2>Active Users</h2>
		<div class="row">
			<div class="col">
				<table class="table table-hover table-striped">
					<thead>
						<tr>
							<th>Name</th>
							<th>Phone No.</th>
							<th style="text-align: right !important">Assign Credits</th>
							<th style="text-align: right !important">Used Credits</th>
							<th style="text-align: right !important">Transaction No.</th>
							<th style="text-align: right !important">Active Installment</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(data, index) in users">
							<td>{{ data.Name }}</td>
							<td>{{ data.Hp }}</td>
							<td class="text-right">
								{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit) }}
								<a href="#" v-b-tooltip title="Increase/Decrease Credit" @click.prevent="openModal('AssignCredit', data, index)">&plusmn;</a>
							</td>
							<td class="text-right">
								{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit-data.remainingcredit) }}
							</td>
							<td class="text-right">
								<a href><small>View Transaction(s)</small></a>
							</td>
							<td class="text-right">
								0
							</td>
							<td class="text-center">
								<a href><small>Ban User</small></a>
							</td>
						</tr>
						<tr v-if="users.length==0">
							<td colspan="4">No active user(s) found!</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<b-modal v-model="modalAssignCredit" size="sm">
			<div slot="modal-header">
				<h4>Assign Credit - {{ modalUserInfo.data.Name }}</h4>
			</div>
			<div class="row">
				<div class="col">
					<p style="font-size: 1.5em">
						<strong>Current Balance</strong><br>{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(modalUserInfo.data.credit) }}
					</p>
					<div class="mb-1">
						<select class="form-control" v-model="selectAssignCredit">
							<option value="">-- Select action --</option>
							<option value="increase">Increase credit</option>
							<option value="decrease">Decrease credit</option>
						</select>
					</div>
					<div v-if="selectAssignCredit=='increase'">
						<label>Amount to add</label>
						<input type="text" class="form-control text-right" placeholder="0.00" v-model="inputCredit">
					</div>
					<div v-if="selectAssignCredit=='decrease'">
						<label>Amount to deduct</label>
						<input type="text" class="form-control text-right" placeholder="0.00" v-model="inputCredit">
					</div>
				</div>
			</div>
			<div slot="modal-footer">
				<button class="btn btn-success mr-2" @click="topUpCredit(modalUserInfo, 'Assign')" v-if="selectAssignCredit=='increase'">Add</button>
				<button class="btn btn-danger mr-2" @click="topUpCredit(modalUserInfo, 'Deduct')" v-if="selectAssignCredit=='decrease'">Deduct</button>
				<button class="btn btn-secondary" @click="modalAssignCredit = false">Close</button>
			</div>
		</b-modal>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			modalAssignCredit: false,
			users: {},
			modalUserInfo: {
				data: {}
			},
			inputCredit: 0,
			selectAssignCredit: ''
		}
	},
	created() {
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/users/activated`, {
			headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
		}).then(res => vm.users = res.data)
	},
	methods: {
		openModal(type, user, index) {
			let vm = this
			switch (type) {
				case "AssignCredit":
					vm.modalAssignCredit = true
					vm.modalUserInfo = {
						data: user,
						index: index
					}
					break
				default:
					alert('error!, contact administrator')
					break
			}
		},
		/**
		 * This will assign or deduct credit
		 * 
		 * @param  obj userData
		 * @param  var @todo the values accepted are 'increase' and 'decrease'
		 */
		topUpCredit(userData, todo) {
			let vm = this
			let dataInput = {
				credit: (todo=='Assign')?vm.inputCredit:-vm.inputCredit,
				activated: '2',
			}

			if (confirm(`${todo} ${vm.inputCredit} credit?`)) {
				axios.post(`${process.env.VUE_APP_API_URL}/users/${userData.data.Hp}/assign-credit`, dataInput, {
					headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
				}).then(() => {
					alert("Credit Balance Updated!")
					vm.users[userData.index].credit = parseFloat(vm.users[userData.index].credit) + parseFloat(dataInput.credit)
					vm.inputCredit = 0
					vm.modalAssignCredit = false
				})
			}
		}
	}
}
</script>
