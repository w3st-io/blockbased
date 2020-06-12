<template>
	<section class="container">
		<h3 class="my-3 text-light">
			Create Block in "{{ cat_id }}
		"</h3>
	
		<!-- [FORM] Create Block -->
		<ValidationObserver v-slot="{ handleSubmit }">
			<form
				@submit.prevent="handleSubmit(createBlock)"
				class="my-4 card card-body bg-dark"
			>
				<ValidationProvider
					tag="div"
					class="form-group" 
					name="confirmation"
					rules="required"
					v-slot="{ errors }"
				>
					<input
						id="create-post"
						type="text"
						class="w-100 form-control text-dark bg-light border-secondary"
						:class="{ 'is-invalid border-danger': errors != '' }"
						placeholder="Create a post.."
						aria-label="Recipient's username"
						v-model="title"
					>
					<!-- Error -->
					<span class="text-danger">{{ errors[0] }}</span>
				</ValidationProvider>

				<!-- Submit Button -->
				<button
					type="submit"
					class="w-100 btn btn-info"
					:disabled="submitted"
				>+ Create</button>
			</form>
		</ValidationObserver>
		
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
	// [IMPORT] Personal //
	import BlockService from '@services/BlockService'
	import UserService from '@services/UserService'
	import router from '@router'

	// [EXPORT] //
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
					router.push({ name: 'Cat', params: { cat_id: this.cat_id, page: 1 } })
				}
				catch(e) { this.error = e }
			},
		}
	}
</script>