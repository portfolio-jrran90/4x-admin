<template>

	<div>

		<h2>Active Users
		</h2>

		<table class="table table-hover table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Status</th>
					<th>Credits</th>
					<th>Installment</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Name 1</td>
					<td>Status 1</td>
					<td>Credits 1</td>
					<td>Installment 1</td>
					<td>
						<a href @click.prevent="modalUserShow = !modalUserShow">
							<i class="nc-icon nc-zoom-split"></i> View
						</a>
					</td>
				</tr>
				<tr>
					<td>Name 2</td>
					<td>Status 2</td>
					<td>Credits 2</td>
					<td>Installment 2</td>
					<td>
						<a href @click.prevent="modalUserShow = !modalUserShow">
							<i class="nc-icon nc-zoom-split"></i> View
						</a>
					</td>
				</tr>
			</tbody>
		</table>

		<b-modal v-model="modalUserShow" size="lg">
			<div slot="modal-header">
				<h4>Detail of Junjun</h4>
			</div>
			<div class="row">
				<div class="col-md-8">
					<!-- <div class="card">
						<div class="card-body"> -->
							<table class="table table-bordered table-sm">
								<tr>
									<td class="table-info">Name</td>
									<td class="table-secondary">Junjun dela Cruz</td>
								</tr>
								<tr>
									<td class="table-info">Gender</td>
									<td class="table-secondary">Male</td>
								</tr>
								<tr>
									<td class="table-info">Date of Birth</td>
									<td class="table-secondary">800 B.C.</td>
								</tr>
								<tr>
									<td class="table-info">Mobile No.</td>
									<td class="table-secondary">911</td>
								</tr>
								<tr>
									<td class="table-info">E-mail</td>
									<td class="table-secondary">email@email.com</td>
								</tr>
								<tr>
									<td class="table-info">Address</td>
									<td class="table-secondary">Planet Namek</td>
								</tr>
							</table>
						<!-- </div>
					</div> -->
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<figure class="figure">
								<img src="http://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/2016/01/deadpool-ryan-reynolds-petition.jpg?itok=BcgLxkHQ" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
								<figcaption class="figure-caption">Picture of the Identification card</figcaption>
							</figure>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<figure class="figure">
								<img src="http://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/2016/01/deadpool-ryan-reynolds-petition.jpg?itok=BcgLxkHQ" class="figure-img img-fluid rounded" alt="A generic square placeholder image with rounded corners in a figure.">
								<figcaption class="figure-caption">Picture holding the Identification card</figcaption>
							</figure>
						</div>
					</div>
				</div>
			</div>

		</b-modal>

	</div>

</template>

<script>
export default {
	data() {
		return {
			modalUserShow: false
		}
	}
}
</script>
