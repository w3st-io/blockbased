<template>
	<!-- [FORM] Create Comment -->
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
					ref="toastuiEditor"
					height="500px"
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
				<span v-show="!loading">+ Create</span>
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

		props: { post_id: { type: String, required: true, }, },

		data: function() {
			return {
				loading: false,
			}
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] Submit *******************/
			async submit() {
				this.loading = true
				
				// [EMIT -->] Editor Text //
				this.$emit('submit', this.$refs.toastuiEditor.invoke('getHtml'))
				console.log(this.$refs.toastuiEditor.invoke('getMarkdown'))
			},

			log() {
				console.log('%%% [COMPONENT] CommentCreate %%%')
				console.log('post_id:', this.post_id)
			},
		},
	}
</script>