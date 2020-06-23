<template>
	<section class="container">
		<!-- [FORM] Create Block -->
		<ValidationObserver v-slot="{ handleSubmit }">
			<form
				@submit.prevent="handleSubmit(submit)"
				class="my-4 card card-body bg-dark"
			>
				<!-- Title -->
				<h3 class="mb-3 text-light">Create Block in "{{ cat_id }}"</h3>

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
				>
					<span v-show="!loading">+ Create</span>
					<span v-show="loading" class="spinner-grow"></span>
					<span v-show="loading" class="sr-only">Loading...</span>
				</button>
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

		created: async function() {
			// [REDIRECT] Not Log Needed //
			//if (!localStorage.usertoken) { router.push({ name: 'Login' }) }

			// Retrieve User Data //
			try {
				let userTokenDecodeData = await UserService.getUserTokenDecodeData()
				this.user_id = userTokenDecodeData._id
				this.email = userTokenDecodeData.email
				this.username = userTokenDecodeData.username
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {
			submit() {
				// Disable Button // Set loading //
				this.submitted = true
				this.loading = true
				
				this.createBlock()
			},

			// [CREATE] Create Post Via PostService Function //
			async createBlock() {
				try {
					await BlockService.createBlock(
						this.user_id,
						this.email,
						this.username,
						this.title,
						this.cat_id
					)

					// [REDIRECT] Cat Page //
					router.push({ name: 'Cat', params: { cat_id: this.cat_id, page: '1' } })
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