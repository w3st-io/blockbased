<template>
	<BContainer>
		<BRow class="mt-3 text-light">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<BRow>
						<BCol cols="8" class="mb-3">
							<h4>Search Results for "{{ query }}"</h4>
						</BCol>

						<BCol cols="4" class="mb-3">
							<PageNavButtons
								:badgeValue="page"
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								class="ml-auto"
								style="max-width: 300px;"
							/>
						</BCol>

						<BCol cols="2">
							<BNav class="flex-column nav-pills">
								<p
									class="m-0 nav-link"
									:class="{ active: type == 'posts' }"
									@click="searchRedirect('posts')"
								>
									<span class="float-left">Posts</span>
									<BBadge variant="light" class="float-right">
										{{ postCount }}
									</BBadge>
								</p>
								<p
									class="m-0 nav-link"
									:class="{ active: type == 'users' }"
									@click="searchRedirect('users')"
								>
									<span class="float-left">Users</span>
									<BBadge variant="light" class="float-right">
										{{ userCount }}
									</BBadge>
								</p>
							</BNav>
						</BCol>

						<BCol cols="10">
							<!-- Loading -->
							<Alert v-if="loading" variant="primary" />

							<!-- Post List -->
							<PostList
								v-if="!loading && type == 'posts'"
								:posts="posts"
								@refreshPosts="getPageData()"
							/>

							<!-- User List -->
							<UserList
								v-if="!loading && type == 'users'"
								:users="reqData.userResults"
							/>
						</BCol>
					</BRow>

					<BRow v-if="error">
						<BCol cols="12">
							<!-- Alert -->
							<Alert variant="danger" :message="error" class="mt-3" />
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import PageNavButtons from '@components/controls/PageNavButtons'
	import Alert from '@components/misc/Alert'
	import PostList from '@components/post/List'
	import UserList from '@components/user/List'
	import PageService from '@services/PageService'
	import router from '@router'
	import { EventBus } from '@main'

	export default {
		components: {
			PageNavButtons,
			Alert,
			PostList,
			UserList
		},

		data() {
			return {
				query: this.$route.params.query,
				type: this.$route.params.type,
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				reqData: '',
				posts: [],
				postCount: 0,
				users: [],
				userCount: 0,
				error: '',
				loading: true,
			}
		},

		async created() {
			await this.getPageData()

			this.log()
		},

		methods: {
			async getPageData() {
				this.loading = true
				try {
					this.reqData = await PageService.s_search(
						this.query,
						this.type,
						this.limit,
						this.page,
					)

					if (this.reqData.status) {
						this.posts = this.reqData.postResults
						this.postCount = this.reqData.postCount
						this.users = this.reqData.userResults
						this.userCount = this.reqData.userCount
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }

				this.loading = false
			},

			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'search',
					params: {
						type: this.type,
						query: this.query,
						limit: this.limit,
						page: this.page,
					}
				})
	
				EventBus.$emit('force-rerender')
			},

			async startPage() {
				if (this.page != 1) {
					this.loading = true
					this.page = 1

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async prevPage() {
				if (this.page != 1) {
					this.loading = true
					this.page--

					this.refreshRoute()


					await this.getPageData()
				}
			},

			async nextPage() {
				if (this.page < this.reqData.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.reqData.totalPages) {
					this.loading = true
					this.page = this.reqData.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			searchRedirect(type) {
				if (this.query) {
					router.push({
						name: 'search',
						params: {
							type: type,
							query: this.query,
							limit: 5,
							page: 1,
						}
					})
	
					EventBus.$emit('force-rerender')
				}
			},

			log() {
				console.log('%%% [PAGE] /search %%%')
				console.log('reqData:', this.reqData)
			}
		},
	}
</script>