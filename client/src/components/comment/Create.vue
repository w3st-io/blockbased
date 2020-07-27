<template>
	<section>
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
	import CommentService from '../../services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: { Editor },

		props: {
			block_id: { type: String, required: true, },
		},

		data: function() {
			return {
				disabled: false,
				loading: false,
				block: {},
				editorText: '',
				error: '',
			}
		},

		created: async function() {
			let valid = await this.validateExistance()

			// If Invalid Block => Disable //
			if (!valid) { this.disabled = true }

			// [LOG] //
			this.log()
		},

		methods: {
			async validateExistance() {
				let status = false

				try { status = await BlockService.validateExistance(this.block_id) } 
				catch(e) { this.error = e }

				return status
			},

			/******************* [BTN] Submit *******************/
			async submit() {
				if (localStorage.usertoken) {
					this.disabled = true
					this.loading = true

					this.create()
				}
				else { this.error = 'Unable to create comment' }
			},

			/******************* [CREATE] Comment *******************/
			async create() {
				this.editorText = this.$refs.toastuiEditor.invoke('getHtml')

				try {
					// Get Block Details
					this.block = await BlockService.read(this.block_id)

					await CommentService.create(
						this.block_id,
						this.block.followers,
						this.editorText
					)
					
					// [REDIRECT] Block Page //
					router.push(
						{
							name: 'Block',
							params: { block_id: this.block_id, page: 1 }
						}
					)
				}
				catch(e) {
					this.loading = false
					this.error = e
				}
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