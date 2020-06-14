<template>
	<section>
		<!-- [FORM] Create Comment -->
		<ValidationObserver v-slot="{ handleSubmit }">
			<form
				@submit.prevent="handleSubmit(createComment)"
				class="mt-4 card card-body bg-dark"
			>
				<!-- Text Area -->
				<ValidationProvider
					tag="div"
					class="form-group" 
					name="confirmation"
					rules="required"
					v-slot="{ errors }"
				>
					<!-- CK Editor -->
					<ckeditor
						:editor="editor"
						:config="editorConfig"
						v-model="comment"
					></ckeditor>

					<!-- Error -->
					<span class="text-danger">{{ errors[0] }}</span>
				</ValidationProvider>
				
				<!-- Submit Button -->
				<button
					type="submit"
					class="w-100 mt-3 btn btn-info"
					:disabled="submitted"
				>+ Create</button>
			</form>
		</ValidationObserver>
		<hr>

		<!-- [STATUS OR ERRORS] -->
		<div v-if="loading" class="alert alert-warning">
			Creating comment..
		</div>
		<div v-if="error" class="alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] //
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

	// [IMPORT] Personal //
	import CommentService from '@services/CommentService'
	import router from '@router'

	export default {
		props: {
			block_id: {
				required: true
			},
			user_id: {
				required: true
			},
			email: {
				type: String,
				required: true,
			},
			username: {
				required: true,
			},
		},

		data: function() {
			return {
				submitted: false,
				loading: false,
				comment: '',
				error: '',

				// Editor Stuff //
				editor: ClassicEditor,
				editorConfig: {
					//toolbar: [ 'bold', 'italic', '-', 'link' ]
				},
			}
		},

		created: function() { this.log() },

		methods: {
			log() {
				console.log('%% CommentCreate Component %%')
				console.log('block_id:', this.block_id)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
			},

			// [CREATE] Create Comment //
			async createComment() {
				this.submitted = true
				this.loading = true

				try {
					await CommentService.createComment(
						this.block_id,
						this.user_id,
						this.email,
						this.username,
						this.comment
					)
					// [REDIRECT] Block Page //
					router.push({
						name: 'Block',
						params: {
							block_id: this.block_id,
							page: 1
						}
					})
				}
				catch(e) {
					this.loading = false
					this.error = e
					}
			},
		},
	}
</script>