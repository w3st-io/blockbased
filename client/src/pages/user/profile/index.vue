<template>
	<BContainer class="my-3">
		<BRow>
			<!-- Loading -->
			<BCol v-if="loading" cols="12">
				<Alert variant="primary" />
			</BCol>

			<!-- User Not Verifed -->
			<BCol v-if="!isVerified" cols="12">
				<BCard bg-variant="danger" class="m-auto">
					<h5 class="text-center text-light">Account Not Verified!</h5>
					<BButton
						variant="outline-light"
						class="w-100"
						@click="resendvCodeEmail()"
					>Click to Resend Email</BButton>
				</BCard>
			</BCol>

			<!-- Email Sent -->
			<BCol v-if="vCodeSent" cols="12" class="mt-3">
				<BCard bg-variant="success" class="m-auto">
					<h5 class="text-center text-light">Email Sent!</h5>
				</BCard>
			</BCol>
		</BRow>

		<Profile
			v-if="!error && !loading"
			:personal="true"
			:user_id="user._id"
			:email="user.email"
			:username="user.username"
			:profile_img="user.profile_img"
			:bio="user.bio"
			:created_at="user.created_at"
			:commentCount="data.commentCount"
			:commentLikeCount="data.commentLikeCount"
			:postCount="data.postCount"
			:postLikeCount="data.postLikeCount"
			:activityData="data.activityData"
		/>

		<BRow class="mt-3">
			<!-- Error -->
			<BCol v-if="error" cols="12">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import Profile from '@/components/user/Profile'
	import router from '@/router'
	import PageService from '@/services/PageService'
	import UserService from '@/services/user/UserService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			Profile,
		},

		data() {
			return {
				returned: {},
				user: {},
				data: {},
				activityLabels: [],
				activityValues: [],
				isVerified: true,
				vCodeSent: false,
				loading: true,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: 'user_login' }) }

			try { this.returned = await await PageService.s_user_profile() }
			catch (err) { this.error = err }

			this.loading = false

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
					this.returned = await UserService.s_resendVerificationEmail(
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