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
					:disabled="submitted"
				>+ Create</button>
			</div>
		</form>
		<hr>

		<!-- [STATUS OR ERRORS] -->
		<div v-if="status != ''" class="alert alert-success">
			{{ status }}
		</div>
		<div v-if="error" class="alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'
	import UserService from '../../services/UserService'
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				submitted: false,
				block_id: this.$route.params.block_id,
				comment: '',
				email: '',
				status: '',
				error: '',
			}
		},

		created: function() {
			this.email = UserService.getEmail()
			console.log('Your Email:', this.email)
		},

		methods: {
			// [CREATE] Create Comment //
			async createComment() {
				this.submitted = true

				try {
					await BlockService.createComment(
						this.block_id,
						this.email,
						this.comment
					)

					this.status = "Successfully Created Comment. Redirecting.."

				// Redirect to Block Page
				router.push({
					name: 'Block',
					params: {
						block_id: this.block_id,
						page: 1
					}
				})

				}
				catch(e) { this.error = e }
			},
		}
	}
</script>