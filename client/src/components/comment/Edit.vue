<template>
	<!-- [FORM] Edit Comment -->
	<ValidationObserver v-slot="{ handleSubmit }">
		<form @submit.prevent="handleSubmit(submit)">
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
					:initialValue="initialEditorText"
					ref="toastuiEditor"
				/>

				<!-- Error -->
				<span class="text-danger">{{ errors[0] }}</span>
			</ValidationProvider>
			
			<!-- Submit Button -->
			<BButton
				:disabled="loading"
				variant="primary"
				type="submit"
				class="w-100"
			>
				<span v-show="!loading">+ Update</span>
				<span v-show="loading" class="spinner-grow"></span>
			</BButton>
		</form>
	</ValidationObserver>
</template>

<script>
	// [IMPORT] //
	import { Editor } from '@toast-ui/vue-editor'
	import 'codemirror/lib/codemirror.css'
	import '@toast-ui/editor/dist/toastui-editor.css'

	// [EXPORT] //
	export default {
		components: { Editor },

		props: { comment: { type: Object, required: true, } },

		data: function() {
			return {
				loading: false,
				initialEditorText: '',
			}
		},

		created: async function() {
			this.initialEditorText = this.comment.text

			// [LOG] //
			this.log()
		},

		methods: {
			async submit() {
				this.loading = true

				// [EMIT -->] Editor Text //
				this.$emit('submit', this.$refs.toastuiEditor.invoke('getHtml'))
			},

			log() {
				console.log('%%% [COMPONENT] CommentEdit %%%')
				console.log('comment:', this.comment)
			},
		},
	}
</script>