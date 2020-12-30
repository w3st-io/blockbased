<template>
	<BContainer class="my-4">
		<!-- Set Page Title -->
		<VueHeadful :title="`Post - ${postTitle}`" />

		<BCard bg-variant="dark">
			<BRow>
				<!-- Title -->
				<BCol sm="10">
					<h3 class="mb-2 text-light">
						{{ post.title }}
						<br>
						<p v-if="post.user" class="small text-secondary hide-the-ugly" style="font-size: .5em;">
							Posted by: {{ post.user.username }} -
							{{ new Date(post.created_at).toLocaleString() }}
						</p>
					</h3>
				</BCol>

				<!-- Follow + Count -->
				<BCol sm="2" class="text-right">
					<div class="mb-3">
						<BBadge variant="light" class="ml-2">{{ post.followsCount }}</BBadge>
						<button
							:disabled="disabled"
							@click="followBtn()"
							class="ml-2 btn btn-sm btn-outline-secondary"
							:class="{ 'btn-outline-success': post.followed }"
						>{{ post.followed ? 'following ✓' : 'follow' }}</button>
					</div>
				</BCol>

				<!-- Add Comment -->
				<BCol cols="12" sm="6">
					<BButton
						:disabled="disabled"
						variant="primary"
						size="sm"
						@click="redirectToPostCommentCreate()"
					>Add Comment</BButton>
				</BCol>

				<!-- Page Control -->
				<BCol cols="12" sm="6">
					<PageNavButtons
						:badgeValue="pageNumber"
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
						class="ml-auto"
						style="max-width: 300px;"
					/>
				</BCol>

				<!-- Comments List -->
				<BCol v-if="!loading" cols="12" class="mt-3">
					<CommentList
						:comments="comments"
						:post_id="post_id"
						@refreshComments="getPageData()"
					/>
				</BCol>

				<!-- [LOADING] -->
				<BCol v-if="loading" cols="12" class="my-3"><Alert /></BCol>
				
				<!-- [DEFAULT] If No content -->
				<BCol v-if="!loading && comments == ''" cols="12">
					<NoContent class="my-3" />
				</BCol>

				<!-- Botton Page Control -->
				<BCol cols="12" class="mt-3">
					<PageNavButtons
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
						:badgeValue="pageNumber"
						class="m-auto w-100"
						style="max-width: 300px;"
					/>
				</BCol>
			</BRow>

			<BRow v-if="error">
				<BCol cols="12">
					<!-- [ALERTS] -->
					<Alert variant="danger" :message="error" class="mt-3" />
				</BCol>
			</BRow>
		</BCard>

		
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import Alert from '@components/misc/Alert'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'
	import PostService from '@services/PostService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			CommentList,
			NoContent,
			PageNavButtons,
		},

		data: function() {
			return {
				post_id: this.$route.params.post_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: parseInt(this.$route.params.limit),
				totalPages: 100000000,

				disabled: false,
				loading: true,
				error: '',

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
			async followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					if (!this.post.followed) {
						try { await PostService.s_follow(this.post._id) }
						catch (err) { this.error = err }
					}
					else {
						try { await PostService.s_unfollow(this.post._id) }
						catch (err) { this.error = err }
					}

					this.getPageData()

					// Enable Buttons //
					this.disabled = false
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
					this.totalPages = this.returned.commentsObj.totalPages
					this.postTitle = this.post.title
				}
				else { this.error = this.returned.message }

				this.loading = false
			},

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
				if (this.pageNumber != this.returned.commentsObj.totalPages) {
					this.loading = true
					this.pageNumber = this.returned.commentsObj.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			redirectToPostCommentCreate() {
				router.push({
					name: 'comment-create',
					params: { post_id: this.post._id, }
				})
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