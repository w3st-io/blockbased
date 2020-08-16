<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Email</th>
					<th>Username</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user._id">
					<td>{{ user.email }}</td>
					<td>{{ user.username }}</td>
					<td>{{ user.first_name }}</td>
					<td>{{ user.last_name }}</td>
					<td>{{ user.createdAt }}</td>
					
					<td class="text-center">
						<button
							@click="banUser(user._id)"
							class="btn btn-outline-danger"
						>Ban</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- [ALERTS] -->
		<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import AUserService from '@services/administration/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				users: {},
				error: '',
			}
		},

		created: async function() {
			// Get Users //
			await this.getUsers()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getUsers() {
				// Get Users //
				try {
					let returnedData = await AUserService.s_readAll()

					if (returnedData.status) { this.users = returnedData.users }
					else { this.error = returnedData.message }
				}
				catch(e) { this.error = e }
			},

			async banUser(user_id) { await AUserService.s_banUser(user_id, 1) },

			log() {
				console.log('%%% [COMPONENT] Admin UsersTable %%%')
				console.log('users:', this.users)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>