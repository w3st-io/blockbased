<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Post - ${post.title}`"/>
		
		<article class="card card-body bg-dark">
			<!-- Title Header -->
			<title-header
				v-if="post"
				:post="post"
				:leftBtnEmitName="'post-page-prev'"
				:rightBtnEmitName="'post-page-next'"
				:badgeValue="pageNumber"
				@refreshPost="getPageData()"
				class="mb-3"
			/>

			<!-- Comments List -->
			<comment-list
				v-if="!loading"
				:comments="comments"
				:post_id="post_id"
				@refreshComments="getPageData()"
			/>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="!loading && comments == ''" class="my-3" />
			
			<!-- [LOADING + ERROR] -->
			<section class="col-12">
				<div v-if="loading" class="my-3 alert alert-primary">
					<div class="d-flex justify-content-center">
						<div class="spinner-grow"></div>
					</div>
				</div>
			</section>

			<!-- Botton Page Control -->
			<section class="mt-3">
				<page-nav-buttons
					:leftBtnEmitName="'post-page-prev'"
					:rightBtnEmitName="'post-page-next'"
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
	import TitleHeader from '@components/post/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
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
				existance: false,
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

			EventBus.$on('post-page-prev', () => { this.prevPage() })
			EventBus.$on('post-page-next', () => { this.nextPage() })

			// [LOG] //
			//this.log()
		},

		methods: {
			async getPageData() {
				try {
					this.returned = await PageService.s_post(
						this.post_id,
						this.limit,
						this.pageNumber - 1
					)
				}
				catch (err) { this.error = err }

				if (this.returned.status) {
					this.post = this.returned.postObj.post
					this.comments = this.returned.commentsObj.comments
				
				}
				else { this.error = this.returned.message }

				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.getPageData()

					router.push({
						name: 'post',
						params: {
							post_id: this.post_id,
							page: this.pageNumber
						}
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages
				if (this.pageNumber == this.pageNumber) {
					this.loading = true
					this.pageNumber++

					this.getPageData()

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
				console.log('existance:', this.existance)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>