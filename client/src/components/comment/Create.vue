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
				<Editor
					ref="editor"
					holder="vue-editor-js"
					:config="{
						tools: {
							code: require('@editorjs/code'),
							delimiter: require('@editorjs/delimiter'),
							header: require('@editorjs/header'),
							list: require('@editorjs/list'),
							quote: require('@editorjs/quote'),
							image: require('@editorjs/simple-image'),
							table: require('@editorjs/table'),
							embed: require('@editorjs/embed'),
						},
					}"
					class="bg-white"
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

		<!-- Error -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</ValidationObserver>
</template>

<script>
	// [IMPORT] //
	import Alert from '@components/misc/Alert'
	import CommentService from '@services/CommentService'
	import router from '@router'

	// [EXPORT] //
	export default {
		components: {
			Alert
		},

		props: {
			post_id: {
				type: String,
				required: true,
			},

			replyToComment_id: {
				type: String,
				required: false,
				default: null,
			}
		},

		data: function() {
			return {
				loading: false,
				error: '',
				cleanJSON: {},
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

				this.$refs.editor._data.state.editor.save()
					.then((cleanJSON) => {
						this.cleanJSON = cleanJSON
						this.create()
					})
					.catch(err => { this.error = err })
			},

			async create() {
				try {
					if (!localStorage.usertoken) {
						this.error = 'Error unable to update comment, no token passed'
						return
					}

					this.data = await CommentService.s_create(
						this.post_id,
						this.cleanJSON,
						this.replyToComment_id,
					)

					if (this.data.status) {
						// [REDIRECT] Post Page //
						router.push({
							name: 'post',
							params: {
								post_id: this.post_id,
								limit: 20,
								page: 1,
							}
						})
					}
					else { this.error = this.data.message }
				}
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [COMPONENT] CommentCreate %%%')
				console.log('post_id:', this.post_id)
				console.log('error:', this.error)
				console.log('replyToComment_id:', this.replyToComment_id)
			},
		},
	}
</script>