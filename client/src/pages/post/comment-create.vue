<template>
	<section class="my-3 container">
		<div class="card card-body bg-dark">
			<h3 class="mb-3 text-light">Create Comment in "{{ post_id }}"</h3>
		
			<!-- Informative Message -->
			<div class="alert alert-info" role="alert">{{ message }}</div>

			<!-- Comment Create Component -->
			<CommentCreate
				v-if="!loading"
				:post_id="post_id"
				@submit="submit"
			/>
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@components/comment/Create'
	import CommentService from '@services/CommentService'
	import PostService from '@services/PostService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate
		},

		data: function() {
			return {
				// Default //
				loading: true,
				post_id: this.$route.params.post_id,
				
				// Post //
				post: {},

				// Comment //
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

			// Get Post Details //
			this.post = await PostService.s_read(this.post_id)

			// Set Loaded //
			this.loading = false

			// [LOG] //
			//this.log()
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
			},
		}
	}
</script>