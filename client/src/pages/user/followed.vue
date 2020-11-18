<template>
	<div class="container mt-3">
		<BCard bg-variant="dark" class="text-light">
			<!-- Title -->
			<section class="row">
				<div class="col-sm-10">
					<h4>Posts You Are Following</h4>

					<!-- Page Control -->
					<PageNavButtons
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						:badgeValue="pageNumber"
						class="w-100 mb-3"
						style="max-width: 300px;"
					/>
				</div>

				<div class="col-sm-2">
					<p class="w-100 badge badge-light">
						Total: {{ totalFollows }}
					</p>
				</div>
			</section>

			<section class="row">
				<div class="col-12">
					<!-- Display All the Posts -->
					<PostList
						v-if="!loading"
						:posts="posts"
						@refreshPosts="getData()"
					/>
				</div>
			</section>

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="!loading && posts == ''" class="mt-3" />

			<!-- [LOADING] -->
			<section v-show="loading" class="row mt-3">
				<div class="col-12">
					<Alert />
				</div>
			</section>

			<!-- [ERROR] -->
			<section v-show="error" class="row mt-3">
				<div class="col-12">
					<Alert BSColor="danger" :message="'Follow Page: ' + error" />
				</div>
			</section>
		</BCard>
	</div>
</template>

<script>
	// [IMPORT] //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import Alert from '@components/misc/Alert'
	import NoContent from '@components/placeholders/NoContent'
	import PostList from '@components/post/List'
	import pageService from '@services/PageService'
	import router from '@router'

	export default {
		components: {
			Alert,
			PageNavButtons,
			PostList,
			NoContent
		},

		data() {
			return {
				pageNumber: parseInt(this.$route.params.page),
				limit: 3,
				loading: true,
				data: {},
				posts: [],
				totalFollows: 0,
				error: '',
			}
		},

		async created() {
			this.getData()

			console.log(this.posts)
		},

		methods: {
			async getData() {
				try {
					this.data = await pageService.s_user_followed(
						this.limit,
						this.pageNumber
					)
				}
				catch (err) { this.error = err }
				
				if (this.data.status) {
					this.posts = this.data.posts
					this.totalFollows = this.data.totalFollows
				}
				else { this.error = this.data.message }
				
				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'user-followed',
						params: { page: this.pageNumber }
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber < this.data.totalPages) {
					this.loading = true
					this.pageNumber++

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'user-followed',
						params: { page: this.pageNumber }
					})
				}
			},
		}
	}
</script>