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
					class="w-100 btn btn-primary"
					:disabled="disabled"
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
	// [IMPORT] //
	import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

	// [IMPORT] Personal //
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			block_id: { type: String, required: true, },
		},

		data: function() {
			return {
				disabled: false,
				loading: false,
				comment: '',
				error: '',

				// CKEditor Stuff //
				editor: ClassicEditor,
				editorConfig: {},
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

			// [CREATE] Create Comment //
			async submit() {
				if (localStorage.usertoken) {
					this.disabled = true
					this.loading = true

					this.create()
				}
				else { this.error = 'Unable to create comment' }
			},

			async create() {
				try {
					await CommentService.create(this.block_id, this.comment)
					
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
				catch(e) {
					this.loading = false
					this.error = e
				}
			},

			log() {
				console.log('%%% [COMPONENT] CommentCreate %%%')
				console.log('block_id:', this.block_id)
			},
		},
	}
</script>