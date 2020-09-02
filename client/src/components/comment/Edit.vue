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
					rules=""
					v-slot="{ errors }"
				>
					<!-- ToastUI Editor -->
					<Editor
						v-if="displayEditor"
						:initialEditType="'wysiwyg'"
						:initialValue="initialEditorText"
						ref="toastuiEditor"
					/>

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
				</button>
			</form>
		</ValidationObserver>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">
			{{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] //
	import { Editor } from '@toast-ui/vue-editor'
	import 'codemirror/lib/codemirror.css'
	import '@toast-ui/editor/dist/toastui-editor.css'

	// [IMPORT] Personal //
	import CommentService from '@services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: { Editor },
		props: {
			comment_id: { type: String, required: true, }
		},

		data: function() {
			return {
				data: {},
				displayEditor: false,
				disabled: false,
				loading: false,
				comment: {},
				editorText: '',
				error: '',
			}
		},

		created: async function() {
			// Get Comment Details //
			await this.getCommentDetails()

			// [LOG] //
			this.log()
		},

		methods: {
			async getCommentDetails() {
				console.log('RUN2')
				try { this.data = await CommentService.s_read(this.comment_id) }
				catch (e) { this.error = e }

				console.log('data', this.data)

				if (this.data) {
					this.comment = this.data.comment
					this.initialEditorText = this.data.comment.text
				}
				else { this.error = this.data.message }

				this.displayEditor = true
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
				this.editorText = this.$refs.toastuiEditor.invoke('getHtml')
				this.disabled = true
				this.loading = false

				try {
					const updated = await CommentService.s_update(
						this.comment_id,
						this.editorText
					)

					if (updated.updated) {
						router.push(
							{
								name: 'Post',
								params: {
									post_id: this.comment.post,
									page: 1
								}
							}
						)
					}
					else { this.error = updated.message }
				}
				catch (e) { this.error = e }	
			},

			log() {
				console.log('%%% [COMPONENT] CommentEdit %%%')
				console.log('comment:', this.comment)
				if (this.error) { console.log('error:', this.error) }
			},
		},
	}
</script>