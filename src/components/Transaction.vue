<template>

  <div>
    <h2>Transaction</h2>
		<table class="table table-hover table-striped">
			<thead>
				<tr>
					<th>No</th>
					<th>HP</th>
					<th>Total</th>
					<th>Merchant</th>
					<th>Item Count</th>
					<th>Date</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(data, index) in transactions">
					<td>{{ data.No }}</td>
					<td>{{ data.HP }}</td>
					<td>{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.Total) }}</td>
					<td>{{ data.merchant }}</td>
					<td>{{ data.itemcount }}</td>
					<td>{{ data.date | moment("YYYY-MM-DD") }}</td>
					<td>
						<a href @click.prevent="openModal(data, index)">
							<i class="nc-icon nc-zoom-split"></i>
						</a>
					</td>
				</tr>
				<tr v-if="transactions.length===0">
					<td colspan="4">No transaction record!</td>
				</tr>
			</tbody>
		</table>

		<b-modal v-model="modalTransactionDetail" size="lg">
			<div slot="modal-header">
				<h4>Transaction Details {{ `- ${transactionDetailHeader}` }} </h4>
			</div>
			<div class="row">
				<div class="col-md-12">
					<table class="table table-striped table-hover">
						<thead>
							<tr>
								<th>No</th>
								<th>Payment Count</th>
								<th>Total</th>
								<th>Payment Due</th>
								<th>Paid Date</th>
								<th>PG</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="data in transactionDetail">
								<td>{{ data.No }}</td>
								<td>{{ data.paymentcount }}</td>
								<td>{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.total) }}</td>
								<td>{{ data.paymentdue }}</td>
								<td>{{ data.paiddate || '---' }}</td>
								<td>{{ data.pg || '---' }}</td>
							</tr>
							<tr v-if="transactionDetail.length===0">
								<td colspan="6">No record found for this transaction!</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div slot="modal-footer">
				<button class="btn btn-lg btn-secondary mr-2" @click="modalTransactionDetail = false">Close</button>
			</div>
		</b-modal>
  </div>

</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			transactions: {},
			transactionDetail: {},
			transactionDetailHeader: '',
			modalTransactionDetail: false,
		}
	},
	created() {
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/transactions`, {
			headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
		}).then(res => vm.transactions = res.data)
	},
	methods: {
		openModal(trans, index) {
			let vm = this
			vm.modalTransactionDetail = true
			axios.get(`${process.env.VUE_APP_API_URL}/transactions/${trans.No}`, {
				headers: { Authorization: "Bearer " + localStorage.getItem('auth_token') }
			}).then(res => {
				vm.transactionDetail = res.data
				vm.transactionDetailHeader = res.data[0].invoice
			})
			// vm.transactionDetail = JSON.parse(trans.transactiondetail)
		},
	}
}
</script>
