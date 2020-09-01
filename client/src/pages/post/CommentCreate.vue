<template>
	<section class="my-3 container">
		<div class="card card-body bg-dark">
			<h3 class="mb-3 text-light">Create Comment in "{{ post_id }}"</h3>
		
			<!-- Comment Create Component -->
			<comment-create v-if="!loading" :post_id="post_id" />
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@components/comment/Create'
	//import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate
		},

		data: function() {
			return {
				loading: true,
				post_id: this.$route.params.post_id,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			//if (!localStorage.usertoken) { router.push({ name: 'Login' }) }			
			
			// Set Loaded //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] PostCommentCreate %%%')
				console.log('post_id:', this.post_id)
			},
		}
	}
</script>