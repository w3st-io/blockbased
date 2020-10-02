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
			<section class="col-12 col-md-9 text-light">
				<!-- User Not Verifed -->
				<div v-if="!isVerified" class="mb-3 card card-body bg-danger">
					<h5 class="text-center">Account Not Verified</h5>

					<button
						@click="resendvCodeEmail"
						class="btn btn-outline-light"
					>Resend Email</button>

				</div>

				<div v-if="vCodeSent" class="mt-3 alert alert-warning">
					Email Sent, Please check your email
				</div>

				<!-- Profile Details -->
				<div class="card card-body bg-dark">
					<h4 class="text-light mb-2">Your Profile</h4>

					<table class="w-100 table-sm table-dark">
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
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				returned: {},
				user: {},
				isVerified: true,
				vCodeSent: false,
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }

			// Retrieve User Profile Data //
			try { this.returned = await await PageService.s_user_profile() }
			catch (err) { this.error = err }

			if (this.returned.status) {
				this.user = this.returned.user
				this.isVerified = this.returned.user.verified
			}
			else { this.error = this.returned.message }

			// [LOG] //
			//this.log()
		},

		methods: {
			redirectProfileEdit() {
				router.push({ name: 'edit' })
			},

			async resendvCodeEmail() {
				if (this.user) {
					this.returned = await UserService.resendVerificationEmail(
						this.user.email
					)

					if (this.returned.status) {
						this.vCodeSent = true
					}
				}
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