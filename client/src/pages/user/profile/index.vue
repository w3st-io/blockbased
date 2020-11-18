<template>
	<div class="container">
		<div class="row mt-4">
			<!-- User Not Verifed -->
				<div v-if="!isVerified" class="col-12 mb-3">
					<BCard bg-variant="danger" class="m-auto">
						<h5 class="text-center text-light">Account Not Verified!</h5>
						<button
							@click="resendvCodeEmail"
							class="btn btn-outline-light"
							
						>Click to Resend Email</button>
					</BCard>
				</div>

			<!-- Side Content -->
			<section class="col-12 col-md-3 hidden-768">
				<BCard bg-variant="dark" class="text-light">
					<img
						:src="user.profileImg"
						alt="Profile Image Here"
						class="m-auto w-100 border border-primary rounded"
					>
					<h4 class="mb-0 text-center text-light">{{ user.username }}</h4>
				</BCard>
			</section>

			<!-- Main Content -->
			<section class="col-12 col-md-9 text-light">
				<!-- NOT Verified Message -->
				<div v-if="vCodeSent" class="mt-3 alert alert-warning">
					Email Sent, Please check your email
				</div>

				<!-- Profile Details -->
				<div class="card bg-dark text-light mb-3">
					<div class="card-header">
						<h4 class="text-primary">Your Profile</h4>
					</div>
					<div class="card-body">
						<p class="m-0 text-secondary">Email</p>
						<p class="">{{ user.email }}</p>

						<p class="m-0 text-secondary">Bio</p>
						<p class="m-0">{{ user.bio }}</p>

						<button
							@click="redirectProfileEdit()"
							class="mt-3 w-100 btn btn-secondary"
						>Edit Your Profile</button>
					</div>
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

					if (this.returned.status) { this.vCodeSent = true }
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