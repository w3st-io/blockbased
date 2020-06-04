<template>
	<section class="container">
		<h3 class="my-3 text-light">Create Comment in "{{ block_id }}"</h3>
		
		<!-- [FORM] create Post -->
		<form class="mt-4">
			<input
				id="create-post"
				type="text"
				class="w-100 form-control text-light bg-dark border-secondary"
				placeholder="Create a post.."
				aria-label="Recipient's username"
				v-model="comment"
			>
			<div class="w-100 input-group-append">
				<button
					type="submit"
					class="w-100 mt-3 btn btn-outline-success"
					v-on:click="createComment()"
				>+ Create</button>
			</div>
		</form>
		<hr>

		<!-- [ERRORS] -->
		<div v-if="error" class="alert alert-danger" role="alert">
			{{ error }}
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				block_id: this.$route.params.block_id,
				comment: '',
				email: 'a@gmail.com',
				error: '',
			}
		},

		methods: {
			// [CREATE] Create Comment //
			async createComment() {
				let result = ''
				try {
					result = await BlockService.createComment(
						this.block_id,
						this.email,
						this.comment
					)
				}
				catch(e) { this.error = e }
				
				if (result) {
					try {
						result = await BlockService.createCommentId(
							this.block_id,
							result.data.newCommentId
						)
					}
					catch (e) { this.error = e }
				}
			},
		}
	}
</script>