<template>
	<BContainer class="my-4">
		<!-- Set Page Title -->
		<VueHeadful :title="`Cat - ${cat.title}`"/>

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

					<!-- Tabs -->
					<BRow class="text-center">
						<ButtonTabs
							:tabs="['recent', 'popular']"
							@tabClicked="tab"
							class="col-12 mx-auto mb-2"
							style="max-width: 300px;"
						/>
					</BRow>

					<!-- Display All the Posts -->
					<BRow>
						<BCol cols="12">
							<PostList
								v-if="!loading"
								:posts="posts"
								@refreshPosts="getPageData()"
							/>
						</BCol>
					</BRow>

					<!-- [DEFAULT] If No content -->
					<BRow>
						<NoContent v-if="!loading && posts == ''" class="mt-3" />
					</BRow>

					<!-- [LOADING] -->
					<BRow v-show="loading" class="mt-3">
						<BCol cols="12">
							<Alert />
						</BCol>
					</BRow>

					<!-- Botton Page Control -->
					<section class="mt-3">
						<PageNavButtons
							@start-btn="startPage()"
							@prev-btn="prevPage()"
							@next-btn="nextPage()"
							@end-btn="endPage()"
							:badgeValue="page"
							class="m-auto w-100"
							style="max-width: 300px;"
						/>
					</section>
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
	import { cats } from '@defaults/cats'

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
				cat: {},
				posts: [],
				error: '',
			}
		},

		created: async function() {
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)

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
				if (this.page < this.data.pageCount) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.data.pageCount) {
					this.loading = true
					this.page = this.data.pageCount

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

				if (this.data.status) { this.posts = this.data.posts }
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