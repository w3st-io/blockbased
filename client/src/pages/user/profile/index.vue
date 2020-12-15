<template>
	<BContainer>
		<BRow class="mt-4">
			<!-- User Not Verifed -->
				<BCol v-if="!isVerified" cols="12" class="mb-3">
					<BCard bg-variant="danger" class="m-auto">
						<h5 class="text-center text-light">Account Not Verified!</h5>
						<BButton
							variant="outline-light"
							@click="resendvCodeEmail"
							class="w-100"
							
						>Click to Resend Email</BButton>
					</BCard>
				</BCol>

			<!-- Side Content -->
			<BCol cols="md-3">
				<BCard bg-variant="dark" class="text-light hidden-768">
					<img
						:src="user.profileImg"
						alt="Profile Image Here"
						class="m-auto w-100 border border-primary rounded"
					>
					<h4 class="mb-0 text-center text-light">{{ user.username }}</h4>
				</BCard>
			</BCol>

			<!-- Main Content -->
			<BCol cols="md-9" class="text-light">
				<!-- NOT Verified Message -->
				<div v-if="vCodeSent" class="mt-3 alert alert-warning">
					Email Sent, Please check your email
				</div>

				<!-- Profile Details -->
				<BCard bg-variant="dark" no-body class="text-light mb-3">
					<BCardHeader>
						<h4 class="text-primary">Your Profile</h4>
					</BCardHeader>
					<BCardBody>
						<p class="m-0 text-secondary">Email</p>
						<p class="">{{ user.email }}</p>

						<p class="m-0 text-secondary">Bio</p>
						<p class="m-0">{{ user.bio }}</p>

						<BButton
							variant="secondary"
							@click="redirectProfileEdit()"
							class="mt-3 w-100"
						>Edit Your Profile</BButton>
					</BCardBody>
				</BCard>
			</BCol>
		</BRow>
		<BRow>
			<BCol cols="md-3"></BCol>

			<BCol cols="md-9">
				<BCard bg-variant="dark">
					<BButton
						bg-variant="dark"
						@click="redirectYourActivity()"
						class="text-light"
					>
						View Your Activity
					</BButton>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
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

			redirectYourActivity() {
				router.push({
					name: 'user_activity',
					params: {
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
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