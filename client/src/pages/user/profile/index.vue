<template>
	<BContainer>
		<BRow>
			<!-- User Not Verifed -->
			<BCol v-if="!isVerified" cols="12" class="mt-3">
				<BCard bg-variant="danger" class="m-auto">
					<h5 class="text-center text-light">Account Not Verified!</h5>
					<BButton
						variant="outline-light"
						class="w-100"
						@click="resendvCodeEmail()"
					>Click to Resend Email</BButton>
				</BCard>
			</BCol>

			<!-- User Not Verifed -->
			<BCol v-if="vCodeSent" cols="12" class="mt-3">
				<BCard bg-variant="success" class="m-auto">
					<h5 class="text-center text-light">Email Sent!</h5>
				</BCard>
			</BCol>
		</BRow>

		<Profile
			v-if="!error"
			:personal="true"
			:user_id="user._id"
			:email="user.email"
			:username="user.username"
			:profileImg="user.profileImg"
			:bio="user.bio"
			:created_at="user.created_at"
			:commentCount="data.commentCount"
			:commentLikeCount="data.commentLikeCount"
			:postCount="data.postCount"
			:postLikeCount="data.postLikeCount"
		/>

		<BRow class="mt-3">
			<BCol cols="12">
				<div v-if="error" class="col-12 alert alert-danger">{{ error }}</div>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Profile from '@components/user/profile'
	import router from '@router'
	import PageService from '@services/PageService'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			Profile
		},

		data: function() {
			return {
				returned: {},
				user: {},
				data: {},
				isVerified: true,
				vCodeSent: false,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }

			try { this.returned = await await PageService.s_user_profile() }
			catch (err) { this.error = err }

			if (this.returned.status) {
				this.data = this.returned
				this.user = this.returned.user
				this.isVerified = this.user.verified
			}
			else { this.error = this.returned.message }

			// [LOG] //
			this.log()
		},

		methods: {
			async resendvCodeEmail() {
				if (this.user) {
					this.returned = await UserService.resendVerificationEmail(
						this.user.email
					)

					if (this.returned.status) { this.vCodeSent = true }
					else { this.error = this.returned.message }
				}
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('returned:', this.returned)
				console.log('user:', this.user)
			},
		},
	}
</script>