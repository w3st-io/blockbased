<template>
	<BContainer class="my-3">
		<BCard bg-variant="dark">
			<h3 class="mb-3 text-light">Create Comment</h3>
		
			<!-- Informative Message -->
			<Alert variant="info" :message="message" />

			<!-- Comment Create Component -->
			<CommentCreate
				v-if="!loading"
				:post_id="post_id"
				@submit="submit"
			/>
		</BCard>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@components/comment/Create'
	import CommentService from '@services/CommentService'
	import Alert from '@components/misc/Alert'
	import PageService from '@services/PageService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate,
			Alert,
		},

		data: function() {
			return {
				// Default //
				loading: true,
				post_id: this.$route.params.post_id,
				pageData: {},
				post: {},
				data: {},

				// Msssage + Error //
				message: `
					Inserting image directly into message will most likely not work
					due to a cap on comments. Please use a URL for any Images. Thank You!
				`,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }			

			// Get Post Details // Assign post data //
			this.pageData = await PageService.s_comment_create(this.post_id)
			this.post = this.pageData.post

			// Set Loaded //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			async submit(editorText) {
				if (localStorage.usertoken) {
					try {
						this.data = await CommentService.s_create(
							this.post_id,
							editorText
						)

						if (this.data.status) {
							// [REDIRECT] Post Page //
							router.push({
								name: 'post',
								params: {
									post_id: this.post_id,
									limit: 5,
									page: 1,
								}
							})
						}
						else { this.error = this.data.message }
					}
					catch (err) { this.error = err }
				}
				else { this.error = 'Error unable to update comment, no token passed' }
			},

			log() {
				console.log('%%% [PAGE] PostCommentCreate %%%')
				console.log('post_id:', this.post_id)
				console.log('pageData:', this.pageData)
				console.log('post:', this.post)
				console.log('data:', this.data)
			},
		}
	}
</script>