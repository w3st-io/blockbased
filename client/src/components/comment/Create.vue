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
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: { Editor },

		props: {
			block_id: { type: String, required: true, },
		},

		data: function() {
			return {
				validBlock: false,
				disabled: false,
				loading: false,
				returned: {},
				block: {},
				editorText: '',
				error: '',
				message: `
					Inserting image directly into message will most likely not work
					due to a cap on comments. Please use a URL for any Images. Thank You!
				`,
			}
		},

		created: async function() {
			try {
				this.validBlock = await BlockService.s_existance(this.block_id)

				// Get Block Details
				this.block = await BlockService.s_read(this.block_id)
			}
			catch (e) { this.error = e }

			// If Invalid Block => Disable //
			if (!this.validBlock) { this.disabled = true }

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
							this.block_id,
							this.editorText
						)
					}
					catch (e) { this.error = `This: Caught Error --> ${e}` }

					this.disabled = false
					this.loading = false

					console.log('returned', this.returned)

					if (this.returned.status) {
						// [REDIRECT] Block Page //
						router.push(
							{
								name: 'Block',
								params: {
									block_id: this.block_id,
									page: 1
								}
							}
						)
					}
					else { this.error = this.returned.message }
				}
				else { this.error = 'Unable to create comment' }
			},

			log() {
				console.log('%%% [COMPONENT] CommentCreate %%%')
				console.log('block_id:', this.block_id)
				console.log('block:', this.block)
				console.log('blockFollowers:', this.block.followers)
			},
		},
	}
</script>