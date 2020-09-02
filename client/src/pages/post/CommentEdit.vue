<template>
	<section class="container">
		<div class="my-3 card card-body bg-dark">
			<h3 class="mb-3 text-light">
				Edit Comment "{{ comment_id }}"
			</h3>
		
			<!-- Comment Edit Component -->
			<comment-edit v-if="!loading" :comment_id="comment_id" />
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentEdit from '@components/comment/Edit'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentEdit
		},

		data: function() {
			return {
				loading: true,
				comment_id: this.$route.params.comment_id,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			// Set Loaded //
			this.loading = false
			
			// [LOG] //
			//this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] CommentEdit %%%')
				console.log('comment_id:', this.comment_id)
			},
		}
	}
</script>