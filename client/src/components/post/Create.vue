<template>
	<section class="col-12">
		<!-- [FORM] Create Post -->
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
		
		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] //
	import { Editor } from '@toast-ui/vue-editor'
	import 'codemirror/lib/codemirror.css'
	import '@toast-ui/editor/dist/toastui-editor.css'

	// [IMPORT] Personal //
	import PostService from '@services/PostService'
	import router from '@router'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: { Editor },

		props: {
			cat_id: { type: String, required: true, }
		},

		data: function() {
			return {
				returned: {},
				cat: {},
				disabled: false,
				loading: false,
				title: '',
				error: '',
			}
		},

		created: async function() {
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)

			// [LOG] //
			//this.log()
		},

		methods: {
			submit() {
				// Disable Button // Set loading //
				this.disabled = true
				this.loading = true
				
				this.createPost()
			},

			// [CREATE] Create Post Via PostService Function //
			async createPost() {
				this.editorText = this.$refs.toastuiEditor.invoke('getHtml')

				try {
					this.returned = await PostService.s_create(
						this.cat_id,
						this.title,
						this.editorText
					)
				}
				catch (err) { this.error = err }
				
				this.disabled = false
				this.loading = false

				if (this.returned.status) {
					// [REDIRECT] Cat Page //
					router.push({
						name: 'Cat',
						params: {
							cat_id: this.cat_id,
							page: 1
						}
					})
				}
				else { this.error = this.returned.message }
			},

			log() {
				console.log('%%% [COMPONENT] PostCreate %%%')
				console.log('cat_id:', this.cat_id)
			},
		},
	}
</script>