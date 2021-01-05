<template>
	<BContainer>
		<BCard bg-variant="dark" class="my-3">
			<Profile
				v-if="!error"
				:user_id="user._id"
				:email="user.email"
				:username="user.username"
				:profile_img="user.profile_img"
				:bio="user.bio"
				:created_at="user.created_at"
				:commentCount="reqData.commentCount"
				:commentLikeCount="reqData.commentLikeCount"
				:postCount="reqData.postCount"
				:postLikeCount="reqData.postLikeCount"
			/>

			<!-- [ALERTS] -->
			<BRow class="my-3">
				<BCol cols="12">
					<Alert v-if="error" variant="danger" :message="error" />
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@components/misc/Alert'
	import Profile from '@components/user/profile'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			Profile,
		},

		data: function() {
			return {
				user_id: this.$route.params.user_id,
				user: {},
				reqData: {},
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'a-login' }) }

			await this.getPageData()

			this.log()
		},

		methods: {
			switchTab(tabClicked) { this.activeTab = tabClicked },
			
			async getPageData() {
				try {
					this.reqData = await PageService.s_admin_function_users_record(
						this.user_id
					)
				}
				catch (err) { this.error = err }

				if (this.reqData.status) { this.user = this.reqData.user }
				else { this.error = this.reqData.message }
			},

			refreshRoute() {},

			log() {
				console.log('%%% [PAGE] /admin/function/users/record %%%')
				console.log('reqData:', this.reqData)
			},
		}
	}
</script>