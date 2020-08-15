<template>
	<div class="container">
		<div class="row mt-4">
			<div class="col-12 card card-body bg-dark">
				<!-- Title -->
				<h2 class="text-white">Your Admin Profile</h2>

				<table class="table table-border table-dark">
					<tr>
						<td>Admin Id</td>
						<td>{{ adminDecoded._id }}</td>
					</tr>
					<tr>
						<td>Username</td>
						<td>{{ adminDecoded.username }}</td>
					</tr>
					<tr>
						<td>Email</td>
						<td>{{ adminDecoded.email }}</td>
					</tr>
					<tr>
						<td>First Name</td>
						<td>{{ adminDecoded.first_name }}</td>
					</tr>
					<tr>
						<td>Last Name</td>
						<td>{{ adminDecoded.last_name }}</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import AdminService from '@services/AdminService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				adminDecoded: {},
			}
		},

		created: async function() {
			// [REDIRECT] Log Required //
			if (!localStorage.admintoken) {
				router.push({ name: 'Dashboard' })
			}

			// Retrieve User Data //
			await this.getAdminData()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getAdminData() {
				try { this.adminDecoded = await AdminService.getAdminTokenDecodeData() }
				catch(e) { this.error = e }
			},

			log() {
				console.log('%%% [PAGE] Admin Profile %%%')
				console.log('adminDecoded:', this.adminDecoded)
			},
		},
	}
</script>

<style scoped>
	td { color: white; }
</style>