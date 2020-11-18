<template>
	<BContainer class="my-4">
		<!-- Set Page Title -->
		<VueHeadful :title="`Post - ${postTitle}`" />
		
		<BRow>
			<BCol cols="12">
				<BCard bg-variant="dark">
					<BRow>
						<BCol cols="12">
							<!-- Post Title Header -->
							<PostTitleHeader
								v-if="post"
								:post="post"
								:badgeValue="pageNumber"
								@refreshPost="getPageData()"
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								class="mb-3"
							/>
						</BCol>
					</BRow>
					
					<BRow>
						<BCol cols="12">
							<!-- Comments List -->
							<CommentList
								v-if="!loading"
								:comments="comments"
								:post_id="post_id"
								@refreshComments="getPageData()"
							/>
						</BCol>
					</BRow>

					<!-- [DEFAULT] If No content -->
					<NoContent v-if="!loading && comments == ''" class="my-3" />
					
					<!-- [LOADING] -->
					<BRow v-show="loading" class="mt-3">
						<BCol cols="12">
							<Alert />
						</BCol>
					</BRow>

					<!-- Botton Page Control -->
					<div class="mt-3">
						<PageNavButtons
							@start-btn="startPage()"
							@prev-btn="prevPage()"
							@next-btn="nextPage()"
							@end-btn="endPage()"
							:badgeValue="pageNumber"
							class="m-auto w-100"
							style="max-width: 300px;"
						/>
					</div>
				</BCard>
			</BCol>
		</BRow>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import Alert from '@components/misc/Alert'
	import PostTitleHeader from '@components/post/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			CommentList,
			PostTitleHeader,
			NoContent,
			PageNavButtons,
		},

		data: function() {
			return {
				post_id: this.$route.params.post_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: parseInt(this.$route.params.limit),

				loading: true,
				error: '',

				totalPages: 100000000,

				returned: {},
				comments: [],
				post: {},
				postTitle: 'unset',
			}
		},

		created: async function() {
			// [INIT-DATA] //
			await this.getPageData()

			// [LOG] //
			this.log()
		},

		methods: {
			async startPage() {
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber = 1

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async prevPage() {
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async nextPage() {
				if (this.pageNumber < this.totalPages) {
					this.loading = true
					this.pageNumber++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.pageNumber != this.returned.commentsObj.pageCount) {
					this.loading = true
					this.pageNumber = this.returned.commentsObj.pageCount

					this.refreshRoute()

					await this.getPageData()
				}
			},

			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'post',
					params: {
						cat_id: this.post_id,
						limit: this.limit,
						page: this.pageNumber,
					}
				})
			},

			async getPageData() {
				try {
					this.returned = await PageService.s_post(
						this.post_id,
						this.limit,
						this.pageNumber
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.returned.status) {
					this.post = this.returned.postObj.post
					this.comments = this.returned.commentsObj.comments
					this.totalPages = this.returned.commentsObj.pageCount
					this.postTitle = this.post.title
				}
				else { this.error = this.returned.message }

				this.loading = false
			},

			log() {
				console.log('%%% [PAGE] Post %%%')
				console.log('returned:', this.returned)
				console.log('post_id:', this.post_id)
				console.log('post:', this.post)
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>