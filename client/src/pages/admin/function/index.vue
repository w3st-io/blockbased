<template>
	<BContainer class="mt-3">
		<BCard bg-variant="dark">
			<!-- Button Tabs -->
			<BRow>
				<BCol cols="6" class="my-3">
					<ButtonTabs :tabs="tabs" @tabClicked="switchTab" />
				</BCol>

				<BCol cols="6" class="text-right my-3"></BCol>
			</BRow>
			
			<BRow class="my-3">
				<BCol cols="12">
					<!-- Users -->
					<Users
						v-show="activeTab == 'users'"
						:users="users"
						@refreshData="getData()"
					/>
					
					<!-- Posts -->
					<Posts
						v-show="activeTab == 'posts'"
						:posts="posts"
						@refreshData="getData()"
					/>

					<!-- Comments -->
					<Comments
						v-show="activeTab == 'comments'"
						:comments="comments"
						@refreshData="getData()"
					/>

					<!-- Reports -->
					<CommentReports
						v-show="activeTab == 'commentReports'"
						:commentReports="commentReports"
						@refreshData="getData()"
					/>
				</BCol>
			</BRow>

			<!-- [ALERTS] -->
			<div v-if="error" class="my-3 alert alert-danger">{{ error }}</div>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Posts from '@components/admin/index/Posts'
	import CommentReports from '@components/admin/index/CommentReports'
	import Comments from '@components/admin/index/Comments'
	import Users from '@components/admin/index/Users'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Posts,
			ButtonTabs,
			CommentReports,
			Comments,
			Users,
		},

		data: function() {
			return {
				tabs: ['users', 'posts', 'comments', 'commentReports'],
				activeTab: '',
				returned: {},
				users: [],
				posts: [],
				comments: [],
				commentReports: [],
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Admin Log Required //
			if (!localStorage.admintoken) { router.push({ name: 'a-login' }) }

			await this.getData()
		},

		methods: {
			switchTab(tabClicked) { this.activeTab = tabClicked },
			
			async getData() {
				try { this.returned = await PageService.s_admin_function() }
				catch (err) { this.error = err }

				if (this.returned.status) {
					this.users = this.returned.users
					this.posts = this.returned.posts
					this.comments = this.returned.comments
					this.commentReports = this.returned.commentReports
				}
				else { this.error = this.returned.message }
			},
		}
	}
</script>