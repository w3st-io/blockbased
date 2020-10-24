<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Cat - ${cat.title}`"/>

		<article class="card card-body bg-dark">
			<!-- Cat Title Header -->
			<CatTitleHeader
				:cat="cat"
				:postCount="data.postsCount"
				:badgeValue="pageNumber"
				@prev-btn="prevPage()"
				@next-btn="nextPage()"
			/>

			<!-- Tabs -->
			<section class="row text-center">
				<ButtonTabs
					:tabs="['recent', 'popular']"
					:initialTab="activeTab"
					@tabClicked="tab"
					class="col-12 mx-auto mb-2"
					style="max-width: 300px;"
				/>
			</section>

			<!-- Display All the Posts -->
			<section class="row">
				<div class="col-12">
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
		</article>

		<!-- [ALERTS] -->
		<section v-show="error" class="row mt-3">
			<div class="col-12">
				<Alert BSColor="danger" :message="'Cat Page: ' + error" />
			</div>
		</section>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import ButtonTabs from '@components/controls/ButtonTabs'
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
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: 5,
				sort: '',
				activeTab: 0,
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
			//this.log()
		},

		methods: {
			tab(tab) {
				this.loading = true

				if (tab == 'recent') {
					this.activeTab = 0
					this.$route.params.tab = 0
				}
				else {
					this.activeTab = 1
					this.$route.params.tab = 1
				}

				this.getData()
			},

			/******************* [INIT] Post *******************/
			async getData() {
				if (this.activeTab == 0) { this.sort = 'descending' }
				else { this.sort = 'popularity' }

				try {
					this.data = await PageService.s_cat(
						this.cat_id,
						this.limit,
						this.pageNumber,
						this.sort,
					)
				}
				catch (err) { this.error = err }

				if (this.data.status) { this.posts = this.data.posts }
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
						name: 'cat',
						params: {
							cat_id: this.cat_id,
							page: this.pageNumber
						}
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber < this.data.pageCount) {
					this.loading = true
					this.pageNumber++

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'cat',
						params: {
							cat_id: this.cat_id,
							page: this.pageNumber
						}
					})
				}
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('limit:', this.limit)
				console.log('cat_id:', this.cat_id)
				console.log('pageNumber:', this.pageNumber)
				console.log('data:', this.data)
				console.log('posts:', this.posts)
				console.log('cat:', this.cat)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>