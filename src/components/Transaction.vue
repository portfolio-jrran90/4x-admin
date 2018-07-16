<template>

    <div>
        <h2>Transaction</h2>
		<table class="table table-hover table-striped">
			<thead>
				<tr>
					<th>Transaction Id</th>
					<th>Balance</th>
					<th>&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="data in transactions">
					<td>{{ data._id }}</td>
					<td>{{ data.initial_balance }}</td>
					<td>
						<a href>
							<i class="nc-icon nc-zoom-split"></i> View
						</a>
					</td>
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
