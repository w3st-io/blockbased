<template>
	<section>
		<!-- Informative Message -->
		<div class="alert alert-info" role="alert">{{ message }}</div>

		<!-- [FORM] Create Comment -->
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
						initialEditType="wysiwyg"
						ref="toastuiEditor"
						height="500px"
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
					<span v-show="!loading">+ Create</span>
					<span v-show="loading" class="spinner-grow"></span>
				</button>
			</form>
		</ValidationObserver>

		<!-- [ALERTSS] -->
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
	import PostService from '@services/PostService'
	import CommentService from '@services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: { Editor },

		props: {
			post_id: { type: String, required: true, },
		},

		data: function() {
			return {
				validPost: false,
				disabled: false,
				loading: false,
				returned: {},
				post: {},
				editorText: '',
				error: '',
				message: `
					Inserting image directly into message will most likely not work
					due to a cap on comments. Please use a URL for any Images. Thank You!
				`,
			}
		},

		created: async function() {
			// Get Post Details //
			this.post = await PostService.s_read(this.post_id)

			// If Invalid Post => Disable //
			if (!this.validPost) { this.disabled = true }

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] Submit *******************/
			async submit() {
				if (localStorage.usertoken) {
					this.disabled = true
					this.loading = true

					this.editorText = this.$refs.toastuiEditor.invoke('getHtml')

					try {
						this.returned = await CommentService.s_create(
							this.post_id,
							this.editorText
						)
					}
					catch (err) { this.error = err }

					this.disabled = false
					this.loading = false

					if (this.returned.status) {
						// [REDIRECT] Post Page //
						router.push(
							{
								name: 'Post',
								params: { post_id: this.post_id, page: 1 }
							}
						)
					}
					else { this.error = this.returned.message }
				}
				else { this.error = 'No token in local storage' }
			},

			log() {
				console.log('%%% [COMPONENT] CommentCreate %%%')
				console.log('post_id:', this.post_id)
				console.log('post:', this.post)
				console.log('post.followers:', this.post.followers)
			},
		},
	}
</script>