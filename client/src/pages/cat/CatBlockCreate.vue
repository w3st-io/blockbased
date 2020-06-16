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
				<!-- Text Input -->
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
		<div v-if="loading" class="alert alert-warning">
			Creating Block..
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
				cat_id: this.$route.params.cat_id,
				submitted: false,
				loading: false,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				title: '',
				error: '',
			}
		},

		created: function() {
			// [REDIRECT] Not Log Needed //
			if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			this.user_id = UserService.getUserId()
			this.email = UserService.getEmail()
			this.username = UserService.getUsername()

			// [LOG] //
			this.log()
		},

		methods: {
			// [CREATE] Create Post Via PostService Function //
			async createBlock() {
				// Disable Button // Set loading //
				this.submitted = true
				this.loading = true

				try {
					await BlockService.createBlock(
						this.user_id,
						this.email,
						this.username,
						this.title,
						this.cat_id
					)

					// [REDIRECT] Cat Page //
					router.push({ name: 'Cat', params: { cat_id: this.cat_id, page: 1 } })
				}
				catch(e) {
					this.loading = false
					this.error = e
				}
			},
			
			log() {
				console.log('%%% [PAGE] CatBlockCreate %%%')
				console.log('cat_id:', this.cat_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},
		}
	}
</script>