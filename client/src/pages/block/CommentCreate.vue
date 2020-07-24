<template>
	<section class="container my-3">
		<!-- Message -->
		<div class="card text-white bg-info mb-3">
			<div class="card-body">
				<p class="card-text">{{ message }}</p>
			</div>
		</div>

		<div class="card card-body bg-dark">
			<h3 class="mb-3 text-light">
				Create Comment in "{{ block_id }}"
			</h3>
		
			<!-- Comment Create Component -->
			<comment-create
				v-if="!loading"
				:block_id="block_id"
			/>
		</div>

		<!-- [ERROR] -->
		<div v-if="error" class="mt-3 alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentCreate from '@components/comment/Create'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			CommentCreate
		},

		data: function() {
			return {
				loading: true,
				block_id: this.$route.params.block_id,
				error: '',
				message: `Inserting image directly into message will most likely not work
				 due to a cap on messages. Please use a URL for any Images. Thank You!`,
			}
		},

		created: async function() {
			// [REDIRECT] Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }			
			
			// Set Loaded //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] BlockCommentCreate %%%')
				console.log('block_id:', this.block_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>