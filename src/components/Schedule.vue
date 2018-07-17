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
					<td></td>
					<td></td>
					<td>{{ data.transactions.created_at }}</td>
					<td class="text-right">{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.transactions.amount) }}</td>
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
		axios.get('http://127.0.0.1:8080/transaction').then(res => vm.transactions = res.data)
	},
}
</script>
