<template>
	<section class="container">
		<h3 class="my-3 text-light">Create Block in "{{ cat_id }}"</h3>
		<!-- [FORM] create Post -->
		<form class="my-4 form-inline">
			<input
				id="create-post"
				type="text"
				class="w-75 form-control text-light bg-dark border-secondary"
				placeholder="Create a post.."
				aria-label="Recipient's username"
				v-model="title"
			>
			<div class="w-25 input-group-append">
				<button
					type="submit"
					class="w-100 ml-3 btn btn-outline-light"
					v-on:click="createBlock()"
					:disabled="submitted"
				>+ Create</button>
			</div>
		</form>
		
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
				cat_id: this.$route.params.cat_id,
				email: '',
				title: '',
				status: '',
				error: '',
			}
		},

		created: function() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			this.email = UserService.getEmail()
			console.log('Your Email:', this.email)
		},

		methods: {
			// [CREATE] Create Post Via PostService Function //
			async createBlock() {
				this.submitted = true

				try {
					await BlockService.createBlock(
						this.email,
						this.title,
						this.cat_id
					)

					this.status = "Successfully Created Block. Redirecting.."

					// Redirect to Cat Page
					router.push({ name: 'Cat', params: { cat_id: this.cat_id } })
				}
				catch(e) { this.error = e }
			},
		}
	}
</script>