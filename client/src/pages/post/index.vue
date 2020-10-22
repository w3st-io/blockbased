<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Post - ${postTitle}`" />
		
		<article class="card card-body bg-dark">
			<!-- Title Header -->
			<TitleHeader
				v-if="post"
				:post="post"
				:badgeValue="pageNumber"
				@refreshPost="getPageData()"
				@prev-btn="prevPage()"
				@next-btn="nextPage()"
				class="mb-3"
			/>

			<section class="row">
				<div class="col-12">
					<!-- Comments List -->
					<CommentList
						v-if="!loading"
						:comments="comments"
						:post_id="post_id"
						@refreshComments="getPageData()"
					/>
				</div>
			</section>

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="!loading && comments == ''" class="my-3" />
			
			<!-- [LOADING] -->
			<section v-show="loading" class="row mt-3">
				<div class="col-12">
					<Alert />
				</div>
			</section>

			<!-- Botton Page Control -->
			<section class="mt-3">
				<PageNavButtons
					@prev-btn="PrevPage()"
					@next-btn="NextPage()"
					:badgeValue="pageNumber"
					class="m-auto w-100"
					style="max-width: 300px;"
				/>
			</section>
		</article>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import Alert from '@components/misc/Alert'
	import TitleHeader from '@components/post/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			CommentList,
			TitleHeader,
			NoContent,
			PageNavButtons,
		},

		data: function() {
			return {
				post_id: this.$route.params.post_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: 5,
				postTitle: 'unset',
				totalPages: 10000,
				loading: true,
				returned: {},
				post: {},
				comments: [],
				error: '',
			}
		},

		created: async function() {
			// [INIT-DATA] //
			await this.getPageData()

			// [LOG] //
			//this.log()
		},

		methods: {
			async getPageData() {
				try {
					this.returned = await PageService.s_post(
						this.post_id,
						this.limit,
						this.pageNumber
					)
				}
				catch (err) { this.error = err }

				if (this.returned.status) {
					this.post = this.returned.postObj.post
					this.comments = this.returned.commentsObj.comments
					this.totalPages = this.returned.commentsObj.pageCount
					this.postTitle = this.post.title
				}
				else { this.error = this.returned.message }

				this.loading = false
			},

			async prevPage() {
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					await this.getPageData()

					router.push({
						name: 'post',
						params: {
							post_id: this.post_id,
							page: this.pageNumber
						}
					})
				}
			},

			async nextPage() {
				if (this.pageNumber < this.totalPages) {
					this.loading = true
					this.pageNumber++

					await this.getPageData()

					router.push({
						name: 'post',
						params: {
							post_id: this.post_id,
							page: this.pageNumber
						}
					})
				}
			},

			log() {
				console.log('%%% [PAGE] Post %%%')
				console.log('post_id:', this.post_id)
				console.log('post:', this.post)
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>