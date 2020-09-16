<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Email</th>
					<th>Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user._id">
					<td>{{ user.email }}</td>
					<td>{{ user.username }}</td>
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
	// [IMPORT] //
	import AUserService from '../../../services/administration/UserService'

	// [EXPORT] //
	export default {
		props: {
			users: { type: Array, required: true, },
		},

		data: function() {
			return {
				error: '',
			}
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			async banUser(user_id) {
				// Ban User //
				try { await AUserService.s_banUser(user_id, 1) }
				catch (err) { this.error = err }

				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin UsersTable %%%')
				console.log('users:', this.users)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>