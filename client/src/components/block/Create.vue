<template>
	<section class="col-12">
		<!-- [FORM] Create Block -->
		<ValidationObserver v-slot="{ handleSubmit }">
			<form @submit.prevent="handleSubmit(submit)">
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
					class="w-100 btn btn-primary"
					:disabled="submitted"
				>
					<span v-show="!loading">+ Create</span>
					<span v-show="loading" class="spinner-grow"></span>
					<span v-show="loading" class="sr-only">Loading...</span>
				</button>
			</form>
		</ValidationObserver>
		
		<!-- [ERRORS] -->
		<div v-if="error" class="mt-3 alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockService from '@services/BlockService'
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			cat_id: { type: String, required: true, }
		},

		data: function() {
			return {
				submitted: false,
				loading: false,
				title: '',
				error: '',
			}
		},

		created: async function() {
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
					await BlockService.create(this.title, this.cat_id)

					// [REDIRECT] Cat Page //
					router.push({ name: 'Cat', params: { cat_id: this.cat_id, page: '1' } })
				}
				catch(e) {
					this.loading = false
					this.error = e
				}
			},

			log() {
				console.log('%%% [COMPONENT] BlockCreate %%%')
				console.log('cat_id:', this.cat_id)
			},
		},
	}
</script>