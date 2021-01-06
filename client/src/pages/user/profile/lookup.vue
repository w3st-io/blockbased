<template>
	<BContainer>
		<BRow>
			<!-- Loading -->
			<BCol v-if="loading" cols="12" class="mt-3">
				<Alert variant="primary" />
			</BCol>
		</BRow>

		<Profile
			v-if="!error && !loading"
			:personal="false"
			:user_id="data.user._id"
			:username="data.user.username"
			:profile_img="data.user.profile_img"
			:bio="data.user.bio"
			:created_at="data.user.created_at"
			:commentCount="data.commentCount"
			:commentLikeCount="data.commentLikeCount"
			:postCount="data.postCount"
			:postLikeCount="data.postLikeCount"
			:activityData="data.activityData"
		/>

		<BRow>
			<BCol v-if="error" cols="12" class="mt-3">
				<Alert variant="danger" :message="error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import Alert from '@components/misc/Alert'
	import Profile from '@components/user/profile'
	import PageService from '@services/PageService'

	export default {
		components: {
			Alert,
			Profile,
		},

		data: function() {
			return {
				user_id: this.$route.params.user_id,
				profile_img: require('../../../assets/images/DefaultProfileImg.png'),
				data: {},
				loading: true,
				error: '',
			}
		},

		created: async function() {
			this.data = await PageService.s_user_profile_lookup(this.user_id)

			this.loading = false

			if (!this.data.status) { this.error = this.data.message }
		},
	}
</script>