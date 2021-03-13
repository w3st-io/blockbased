<template>
	<BContainer class="my-3">
		<BRow>
			<!-- Loading -->
			<BCol v-if="loading" cols="12">
				<Alert variant="primary" />
			</BCol>
		</BRow>

		<Profile
			v-if="!error && !loading"
			:personal="false"
			:user_id="reqData.user._id"
			:username="reqData.user.username"
			:profile_img="reqData.user.profile_img"
			:bio="reqData.user.bio"
			:created_at="reqData.user.created_at"
			:commentCount="reqData.commentCount"
			:commentLikeCount="reqData.commentLikeCount"
			:postCount="reqData.postCount"
			:postLikeCount="reqData.postLikeCount"
			:activityData="reqData.activityData"
		/>

		<BRow v-if="!error && !loading && reqData.adminData">
			<BCol cols="12" class="mt-3 text-light">
				<BCard bg-variant="dark" border-variant="warning">
					<BRow>
						<!-- commentReports -->
						<BCol cols="12" class="text-center">
							<h5>Admin Data</h5>
						</BCol>

						<!-- commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Comment Report<br>
									{{ reqData.adminData.commentReportCount }}
								</h6>
							</BBadge>
						</BCol>

						<!-- Handled commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Handled Comment Report<br>
									{{ reqData.adminData.commentReportHandledCount }}
								</h6>
							</BBadge>
						</BCol>

						<!-- Unhandled commentReports -->
						<BCol cols="12" lg="4" class="mb-3">
							<BBadge variant="secondary" class="w-100">
								<h6>
									Unhandled Comment Report<br>
									{{ reqData.adminData.commentReportUnhandledCount }}
								</h6>
							</BBadge>
						</BCol>
					</BRow>					
				</BCard>
			</BCol>
		</BRow>

		<BRow>
			<BCol v-if="error" cols="12" class="mt-3">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import Alert from '@/components/inform/Alert'
	import Profile from '@/components/user/Profile'
	import PageService from '@/services/PageService'

	export default {
		components: {
			Alert,
			Profile,
		},

		data() {
			return {
				user_id: this.$route.params.user_id,
				profile_img: require('../../../assets/images/pages/user/profile/lookup/DefaultProfileImg.png'),
				reqData: {},
				loading: true,
				error: '',
			}
		},

		created: async function() {
			this.reqData = await PageService.s_user_profile_lookup(this.user_id)

			this.loading = false

			if (!this.reqData.status) { this.error = this.reqData.message }

			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] user/profile/lookup/:user_id %%%')
				console.log('reqData:', this.reqData)
			}
		},
	}
</script>