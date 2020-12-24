<template>
	<BContainer>
		<Profile
			v-if="!error"
			:personal="false"
			:user_id="data.user._id"
			:username="data.user.username"
			:profileImg="data.user.profileImg"
			:bio="data.user.bio"
			:created_at="data.user.created_at"
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
	import Profile from '@components/user/profile'
	import PageService from '@services/PageService'

	export default {
		data: function() {
			return {
				user_id: this.$route.params.user_id,
				profileImg: require('../../../assets/images/DefaultProfileImg.png'),
				data: {},
				error: '',
			}
		},

		components: {
			Profile,
		},

		created: async function() {
			this.data = await PageService.s_user_profile_lookup(this.user_id)

			console.log(this.data)

			if (!this.data.status) { this.error = this.data.message }
		},
	}
</script>