<template>

    <div>
        <h2>Schedule</h2>
		<table class="table table-hover table-striped">
			<thead>
				<tr>
					<th class="col-md-4">Name</th>
					<th class="col-md-4">Item Name</th>
					<th class="col-md-2">Date of Transaction</th>
					<th class="col-md-2" style="text-align: right !important">Installment Amount</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="data in transactions">
					<td>{{ `${data.user[0].firstname} ${data.user[0].lastname}` }}</td>
					<td>{{ data.transactions.item_name }}</td>
					<td>{{ data.transactions.created_at }}</td>
					<td class="text-right">{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.transactions.amount) }}</td>
				</tr>
				<tr v-if="transactions.length===0">
					<td colspan="4">No schedule(s) found!</td>
				</tr>
			</tbody>
		</table>
    </div>

</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {
			transactions: {}
		}
	},
	created() {
		let vm = this
		axios.get(`${process.env.VUE_APP_API_URL}/transaction`).then(res => vm.transactions = res.data)
	},
}
</script>
