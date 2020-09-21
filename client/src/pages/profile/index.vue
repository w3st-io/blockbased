<template>
	<div class="container">
		<div class="row mt-4">
			<!-- Side Content -->
			<section class="col-12 col-md-3 hidden-768">
				<div class="card card-body bg-dark">
					<img
						:src="user.profileImg"
						alt="Profile Image Here"
						class="w-100"
					>
				</div>
			</section>

			<!-- Main Content -->
			<section class="col-12 col-md-9">
				<div class="card card-body bg-dark">
					<h4 class="text-light mb-2">Your Profile</h4>

					<table class="w-100 table-sm table-dark text-light">
						<tr>
							<td>Username</td>
							<td>{{ user.username }}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{{ user.email }}</td>
						</tr>
					</table>

					<button
						@click="redirectProfileEdit()"
						class="mt-3 btn btn-secondary"
					>Edit Your Profile</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				data: {},
				user: {},
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }

			// Retrieve User Profile Data //
			try { this.data = await await PageService.s_profile() }
			catch (err) { this.error = err }

			if (this.data.status) { this.user = this.data.user }
			else { this.error = this.data.message }

			// [LOG] //
			//this.log()
		},

		methods: {
			redirectProfileEdit() {
				router.push({ name: 'edit' })
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('user:', this.user)
			},
		},
	}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 768px) {
		.hidden-768 {
			display: none !important;
		}
	}
</style>