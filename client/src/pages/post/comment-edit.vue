<template>
	<section class="container">
		<BCard bg-variant="dark" class="my-3">
			<h3 class="mb-3 text-light">
				Edit Comment "{{ comment_id }}"
			</h3>

			<!-- Comment Edit Component -->
			<CommentEdit
				v-if="!loading && comment != {}"
				:comment="comment"
				@submit="submit"
			/>
		</BCard>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentEdit from '@components/comment/Edit'
	import CommentService from '@services/CommentService'
	import PageService from '@services/PageService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentEdit
		},

		data: function() {
			return {
				// Default //
				comment_id: this.$route.params.comment_id,
				loading: true,

				// Comment //
				data: {},
				comment: {},

				// Error //
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'login' }) }

			// Get Comment Details //
			await this.getPage()

			// Set Loaded //
			this.loading = false
			
			// [LOG] //
			this.log()
		},

		methods: {
			async getPage() {
				try { this.data = await PageService.s_post_commentEdit(this.comment_id) }
				catch (err) { this.error = err }

				if (this.data.status) { this.comment = this.data.comment }
				else { this.error = this.data.message }
			},

			async submit(editorText) {
				if (localStorage.usertoken) {
					try {
						const comment = await CommentService.s_update(
							this.comment_id,
							editorText
						)

						if (comment.updated) {
							// [REDIRECT] Post Page //
							router.push({
								name: 'post',
								params: {
									post_id: this.comment.post,
									limit: 5,
									page: 1,
								}
							})
						}
						else { this.error = comment.message }
					}
					catch (err) { this.error = err }
				}
				else { this.error = 'Error unable to update comment, no token passed' }
			},

			log() {
				console.log('%%% [PAGE] CommentEdit %%%')
				console.log('comment:', this.comment)
				console.log('comment_id:', this.comment_id)
			},
		}
	}
</script>