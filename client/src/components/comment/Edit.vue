<template>
	<section>
		<!-- [FORM] Edit Comment -->
		<ValidationObserver v-slot="{ handleSubmit }">
			<form	@submit.prevent="handleSubmit(submit)">
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
						v-model="text"
					></ckeditor>

					<!-- Error -->
					<span class="text-danger">{{ errors[0] }}</span>
				</ValidationProvider>
				
				<!-- Submit Button -->
				<button
					type="submit"
					class="w-100 btn btn-primary"
					:disabled="disabled"
				>
					<span v-show="!loading">+ Update</span>
					<span v-show="loading" class="spinner-grow"></span>
					<span v-show="loading" class="sr-only">Loading...</span>
				</button>
			</form>
		</ValidationObserver>

		<!-- [ERROR] -->
		<div v-if="error" class="mt-3 alert alert-danger">
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

	// [EXPORT] //
	export default {
		props: {
			comment_id: { type: String, required: true, }
		},

		data: function() {
			return {
				disabled: false,
				loading: false,
				commentDetails: {},
				text: '',
				error: '',

				// CKEditor Stuff //
				editor: ClassicEditor,
				editorConfig: {},
			}
		},

		created: async function() { 
			// Check if Comment is Valid //
			this.validateExistance()

			// Get Comment Details //
			await this.getCommentDetails()

			// [LOG] //
			this.log()
		},

		methods: {
			async validateExistance() {
				try { console.log('Incomplete') }
				catch (e) { this.error = e }
			},
			
			async getCommentDetails() {
				try {
					this.commentDetails = await CommentService.read(this.comment_id)

					this.text = this.commentDetails.text
				}
				catch(e) { this.error = e }
			},

			async submit() {
				if (localStorage.usertoken) {
					this.disabled = true
					this.loading = true

					this.update()
				}
				else { this.error = 'Error unable to create comment' }
			},

			// [UPDATE] Comment //
			async update() {
				try {
					await CommentService.update(this.comment_id, this.text)

					router.push(
						{
							name: 'Block',
							params: {
								block_id: this.commentDetails.block_id,
								page: 1
							}
						}
					)
				}
				catch(e) { this.error = e }
				
			},

			log() {
				console.log('%%% [COMPONENT] CommentEdit %%%')
				console.log('comment_id:', this.comment_id)
				console.log('commentDetails:', this.commentDetails)
				if (this.error) { console.log('error:', this.error) }
			},
		},
	}
</script>