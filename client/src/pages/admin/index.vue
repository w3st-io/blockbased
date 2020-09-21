<template>
	<article class="mx-5 my-3 card card-body bg-dark">
		<!-- Button Tabs -->
		<div class="row">
			<div class="col-6 my-3">
				<button-tabs :tabs="tabs" @tabClicked="switchTab" />
			</div>

			<div class="col-6 text-right my-3"></div>
		</div>
		
		<div class="my-3">
			<!-- Users -->
			<users
				v-show="activeTab == 'users'"
				:users="users"
				@refreshData="getData()"
			/>
			
			<!-- Posts -->
			<posts
				v-show="activeTab == 'posts'"
				:posts="posts"
				@refreshData="getData()"
			/>

			<!-- Comments -->
			<comments
				v-show="activeTab == 'comments'"
				:comments="comments"
				@refreshData="getData()"
			/>

			<!-- Reports -->
			<comment-reports
				v-show="activeTab == 'commentReports'"
				:commentReports="commentReports"
				@refreshData="getData()"
			/>
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="my-3 alert alert-danger">{{ error }}</div>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import Posts from '@components/admin/index/Posts'
	import CommentReports from '@components/admin/index/CommentReports'
	import Comments from '@components/admin/index/Comments'
	import Users from '@components/admin/index/Users'
	import ButtonTabs from '@components/controls/ButtonTabs'
	import router from '@router'
	import PageService from '../../services/PageService'

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
				try { this.returned = await PageService.s_admin() }
				catch (err) { this.error = err }

				if (this.returned.status) {
					this.users = this.returned.users
					this.posts = this.returned.posts
					this.comments = this.returned.comments
					this.commentReports = this.returned.commentReports
				}
				else { this.error = this.returned.message }

				console.log('THE DATA:', this.returned)
			},
		}
	}
</script>