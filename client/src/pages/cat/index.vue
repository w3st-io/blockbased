<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Cat - ${cat.title}`"/>

		<article class="card card-body bg-dark">
			<!-- Title With Create Button -->
			<TitleHeader
				:cat="cat"
				:postCount="data.postCount"
				:badgeValue="pageNumber"
				@prev-btn="prevPage()"
				@next-btn="nextPage()"
			/>

			<ButtonTabs
				:tabs="['recent', 'popular']"
				:initialTab="activeTab"
				@tabClicked="tab"
				class="mx-auto mb-2"
				style="max-width: 300px;"
			/>

			<!-- Display All the Posts -->
			<PostList
				v-if="!loading"
				:posts="posts"
				@refreshPosts="getData()"
			/>

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="!loading && posts == ''" class="mt-3" />

			<!-- [LOADING] -->
			<div v-show="loading" class="m-0 mt-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>
		</article>

		<!-- [ALERTS] -->
		<div v-show="error" class="mt-3 alert alert-danger">
			Cat Page: {{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import ButtonTabs from '@components/controls/ButtonTabs'
	import PostList from '@components/post/List'
	import TitleHeader from '@components/cat/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PageService from '@services/PageService'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			PostList,
			ButtonTabs,
			NoContent,
			TitleHeader,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				activeTab: 0,
				limit: 5,
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
				console.log('tab', tab)
				
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
				let sort = ''
				let pageIndex = this.pageNumber - 1

				if (this.activeTab == 0) { sort = 'descending' }
				else { sort = 'popularity' }

				try {
					this.data = await PageService.s_cat(
						this.cat_id,
						this.limit,
						pageIndex,
						sort,
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