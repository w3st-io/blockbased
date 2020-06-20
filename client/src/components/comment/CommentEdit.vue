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
						v-model="comment"
					></ckeditor>

					<!-- Error -->
					<span class="text-danger">{{ errors[0] }}</span>
				</ValidationProvider>
				
				<!-- Submit Button -->
				<button
					type="submit"
					class="w-100 btn btn-info"
					:disabled="submitted"
				>+ Update</button>
			</form>
		</ValidationObserver>

		<!-- [STATUS OR ERRORS] -->
		<div v-if="loading" class="mt-3 alert alert-warning">
			Creating comment..
		</div>
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
	//import router from '@router'

	export default {
		props: {
			comment_id: {
				type: String,
				required: true
			}
		},

		data: function() {
			return {
				submitted: false,
				loading: false,
				commentDetails: {},
				comment: '',
				error: '',

				// CKEditor Stuff //
				editor: ClassicEditor,
				editorConfig: {},
			}
		},

		created: async function() { 
			// Get Comment Details //
			try {
				this.commentDetails = await CommentService.getComment(
					this.comment_id
				)

				// Set Comment To Retrieved Comment //
				this.comment = this.commentDetails.comment
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {
			// [CREATE] Create Comment //
			async submit() {
				if (localStorage.usertoken) {
					this.submitted = true
					this.loading = true

					this.updateComment()
				}
				else { this.error = 'Error unable to create comment' }
			},

			async updateComment() {},

			async validateExistance() {},

			log() {
				console.log('%%% [COMPONENT] CommentEdit %%%')
				console.log('localStorage.userToken:', localStorage.usertoken)
				console.log('comment_id:', this.comment_id)
				console.log('commentDetails:', this.commentDetails)
				if (this.error) { console.log('error:', this.error) }
			},
		},
	}
</script>