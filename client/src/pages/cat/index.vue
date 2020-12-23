<template>
	<BContainer class="my-4 text-light">
		<!-- Set Page Title -->
		<VueHeadful :title="`Cat - ${cat.title}`" />
		<BRow class="row">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<!-- Cat Title Header -->
					<CatTitleHeader
						:cat="cat"
						:postCount="data.postsCount"
						:badgeValue="page"
						@start-btn="startPage()"
						@prev-btn="prevPage()"
						@next-btn="nextPage()"
						@end-btn="endPage()"
					/>

					<BRow class="text-center">
						<BCol cols="12">
							<!-- Tabs -->
							<ButtonTabs
								:tabs="['recent', 'popular']"
								@tabClicked="tab"
								class="mx-auto mb-2"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>

					<BRow>
						<BCol cols="12">
							<!-- Display All the Posts -->
							<PostList
								v-if="!loading"
								:posts="posts"
								@refreshPosts="getPageData()"
							/>
						</BCol>
					</BRow>

					<BRow>
						<BCol cols="12">
							<!-- [DEFAULT] If No content -->
							<NoContent v-if="!loading && posts == ''" class="mt-3" />
						</BCol>
					</BRow>

					<BRow v-show="loading" class="mt-3">
						<BCol cols="12">
							<!-- [LOADING] -->
							<Alert />
						</BCol>
					</BRow>

					<BRow class="mt-3">
						<BCol cols="12">
							<!-- Botton Page Control -->
							<PageNavButtons
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								:badgeValue="page"
								class="m-auto w-100"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>

		<!-- [ALERTS] -->
		<BRow v-show="error" class="mt-3">
			<BCol cols="12">
				<Alert BSColor="danger" :message="'Cat Page: ' + error" />
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import ButtonTabs from '@components/controls/ButtonTabs'
	import PageNavButtons from '@components/controls/PageNavButtons'
	import Alert from '@components/misc/Alert'
	import PostList from '@components/post/List'
	import CatTitleHeader from '@components/cat/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			PostList,
			ButtonTabs,
			NoContent,
			CatTitleHeader,
			PageNavButtons,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				data: {},
				cats: [],
				posts: [],
				cat: {},
				error: '',
			}
		},

		created: async function() {
			// [LOG] //
			this.log()
		},

		methods: {
			async tab(tab) {
				this.loading = true

				if (tab == 'recent') { this.sort = 0 }
				else { this.sort = 1 }

				this.refreshRoute()

				await this.getPageData()
			},

			async startPage() {
				// As long as the page is not going into 0 or negative //
				if (this.page != 1) {
					this.loading = true
					this.page = 1
					
					this.refreshRoute()

					await this.getPageData()
				}
			},

			async prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.page != 1) {
					this.loading = true
					this.page--
					
					this.refreshRoute()
					
					await this.getPageData()
				}
			},

			async nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.page < this.data.postsObj.pageCount) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.data.postsObj.pageCount) {
					this.loading = true
					this.page = this.data.postsObj.pageCount

					this.refreshRoute()

					await this.getPageData()
				}
			},

			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'cat',
					params: {
						cat_id: this.cat_id,
						sort: this.sort,
						limit: this.limit,
						page: this.page,
					}
				})
			},

			async getPageData() {
				try {
					this.data = await PageService.s_cat(
						this.cat_id,
						this.sort,
						this.limit,
						this.page,
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) {
					// Store Posts & Cats //
					this.posts = this.data.postsObj.posts
					this.cats = this.data.cats

					// Get Cat Details //
					this.cat = this.cats.find(cat => cat.cat_id === this.cat_id)
				}
				else { this.error = this.data.message }

				this.loading = false
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('limit:', this.limit)
				console.log('cat_id:', this.cat_id)
				console.log('page:', this.page)
				console.log('data:', this.data)
				console.log('posts:', this.posts)
				console.log('cat:', this.cat)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>