<template>
	<div>
		<BRow class="">
			<BCol sm="6" md="3" class="mb-2">
				<BButton variant="outline-warning" class="w-100" @click="redirectDashboard()">
					Dashboard
				</BButton>
			</BCol>
		</BRow>

		<BRow class="">
			<BCol sm="6" md="3" class="mb-2">
				<BButton variant="outline-warning" class="w-100" @click="redirectCommentReports()">
					commentReports
				</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton variant="outline-warning" class="w-100" @click="redirectComments()">
					comments
				</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton variant="outline-warning" class="w-100" @click="redirectPosts()">
					posts
				</BButton>
			</BCol>

			<BCol sm="6" md="3" class="mb-2">
				<BButton variant="outline-warning" class="w-100" @click="redirectUsers()">
					users
				</BButton>
			</BCol>
		</BRow>
	</div>
</template>

<script>
	import router from '@router'

	export default {
		methods: {
			redirectDashboard() {
				router.push({ name: 'admin' }) 
			},

			redirectCommentReports() {
				router.push({
					name: 'admin-function-comment-reports',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectComments() {
				router.push({
					name: 'admin-function-comments',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},


			redirectPosts() {
				router.push({
					name: 'admin-function-posts',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectUsers() {
				router.push({
					name: 'admin-function-users',
					params: {
						sort: 0,
						limit: 5,
						page: 1,
					}
				})
			},
		},
	}
</script>