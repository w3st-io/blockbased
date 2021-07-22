<template>
	<section>
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
					<h1>{{ showEditor }}</h1>
					<!-- Editorjs -->
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
						class="bg-white border border-primary"
					/>

					<!-- Error -->
					<span class="text-danger">{{ errors[0] }}</span>
				</ValidationProvider>

				<!-- Submit Button -->
				<BButton
					:disabled="disabled"
					variant="primary"
					type="submit"
					class="w-100"
				>
					<span v-show="!loading">+ Create</span>
					<span v-show="loading" class="spinner-grow"></span>
				</BButton>
			</form>
		</ValidationObserver>
		
		<!-- Error -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@/components/inform/Alert'
	import PostService from '@/services/user/PostService'
	import router from '@/router'

	// [EXPORT] //
	export default {
		components: {
			Alert,
		},

		props: {
			cat: {
				type: Object,
				required: true,
			}
		},

		data() {
			return {
				disabled: false,
				loading: false,
				error: '',
				reqData: {},
				title: '',
				cleanJSON: {},
			}
		},

		created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			submit() {
				// Disable Button // Set loading //
				this.disabled = true
				this.loading = true
				
				this.$refs.editor._data.state.editor.save()
					.then((cleanJSON) => {
						this.cleanJSON = cleanJSON
						this.postCreate()
					})
					.catch(err => { this.error = err })
			},

			// [CREATE] Create Post Via PostService Function //
			async postCreate() {
				try {
					if (!localStorage.usertoken) {
						this.error = 'Error unable to create post, not logged in'
						return
					}

					this.reqData = await PostService.s_create(
						this.cat.cat_id,
						this.title,
						this.cleanJSON
					)

					this.disabled = false
					this.loading = false

					if (this.reqData.status) {
						// [REDIRECT] Cat Page //
						router.push({
							name: 'cat',
							params: {
								cat_id: this.cat.cat_id,
								sort: 0,
								limit: 20,
								page: 1,
							}
						})
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},

			log() {
				console.log('%%% [COMPONENT] PostCreate %%%')
				console.log('cat:', this.cat)
			},
		},
	}
</script>