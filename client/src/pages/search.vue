<template>
	<BContainer class="my-5">
		<!-- Search Result -->
		<BRow class="">
			<BCol cols="12" class="text-primary">
				<h4>
					Search Results for "{{ $route.params.query }}"
				</h4>
			</BCol>
		</BRow>

		<BCard bg-variant="dark" text-variant="light" class="shadow">
			<BTabs pills>
				<!-- Cryptocurrencies -->
				<BTab
					title="Cryptocurrencies"
					v-bind="{ active: $route.params.tab == 0 }"
				>
					<BCardText>
						<BRow>
							<BCol cols="12">
								<hr class="my-4 border-secondary">
							</BCol>
						</BRow>

						<BRow v-if="coinbaseResults.length !== 0" class="mb-5">
							<!-- Coinbase -->
							<BCol cols="12">
								<h3>Coinbase Results</h3>
							</BCol>
						
							<BCol
								v-for="(r, i) in coinbaseResults" :key="i"
								cols="12" md="6" lg="4"
							>
								<BCard
									@click="viewAsset('coinbase', r.id)"
									bg-variant="dark"
									text-variant="light"
									border-variant="primary"
									class="mb-4 result-option"
								>{{ r.display_name }}</BCard>
							</BCol>
						</BRow>

						<BRow v-else class="mb-5">
							<BCol cols="12">
								<!-- [DEFAULT] If No content -->
								<NoContent text="No Products Found" class="mx-auto my-3" />
							</BCol>
						</BRow>

						<BRow>
							<BCol cols="12">
								<BRow>
									<BCol cols="12">
										<h3 class="text-primary">Suggested</h3>
										<hr class="my-4 bg-secondary">
									</BCol>

									<BCol
										v-for="(s, i) in suggested" :key="i"
										cols="12" md="6" lg="4"
									>
										<BCard
											@click="viewAsset('coinbase', s.id)"
											bg-variant="dark"
											text-variant="light"
											border-variant="primary"
											class="mb-4 result-option"
										>{{ s.display_name }}</BCard>
									</BCol>
								</BRow>
							</BCol>
						</BRow>

						<BRow v-if="error">
							<BCol cols="12">{{ error }}</BCol>
						</BRow>
					</BCardText>
				</BTab>

				<!-- All Other Searches -->
				<BTab
					title="All Other Searches"
					v-bind="{ active: $route.params.tab == 1 }"
				>
					<BCardText>
						<hr class="my-4 border-secondary">
						<BRow>
							<BCol cols="2">
								<BNav class="flex-column nav-pills">
									<p
										class="m-0 mb-2 nav-link"
										:class="{ active: type == 'posts' }"
										@click="searchRedirect('posts')"
									>
										<span class="float-left">Posts</span>
										<BBadge
											variant="light"
											class="float-right"
											style="font-size: 1em;"
										>{{ postCount }}</BBadge>
									</p>
									<p
										class="m-0 mb-2 nav-link"
										:class="{ active: type == 'users' }"
										@click="searchRedirect('users')"
									>
										<span class="float-left">Users</span>
										<BBadge
											variant="light"
											class="float-right"
											style="font-size: 1em;"
										>{{ userCount }}</BBadge>
									</p>
								</BNav>
							</BCol>

							<BCol cols="10">
								<PageNavButtons
									:badgeValue="page"
									@start-btn="startPage()"
									@prev-btn="prevPage()"
									@next-btn="nextPage()"
									@end-btn="endPage()"
									class="ml-auto"
									style="max-width: 300px;"
								/>

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
								<h6 class="text-danger">{{ error }}</h6>
							</BCol>
						</BRow>
					</BCardText>
				</BTab>
			</BTabs>
		</BCard>
	</BContainer>
</template>

<script>
	import coinbaseAPI from '@/api/crypto/coinbaseAPI'
	import PageNavButtons from '@/components/controls/PageNavButtons'
	import Alert from '@/components/inform/Alert'
	import PostList from '@/components/post/List'
	import UserList from '@/components/user/List'
	import NoContent from '@/components/placeholders/NoContent'
	import PageService from '@/services/PageService'
	import router from '@/router'
	import { EventBus } from '@/main'

	export default {
		components: {
			PageNavButtons,
			Alert,
			PostList,
			UserList,
			NoContent,
		},

		data() {
			return {
				type: this.$route.params.type,
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				coinbaseResults: [],
				posts: [],
				postCount: 0,
				users: [],
				userCount: 0,
				
				reqData: '',

				loading: true,
				error: '',

				suggested: [
					{
						id: "BTC-USD",
						display_name: "BTC/USD",
					},
					{
						id: "ETH-USD",
						display_name: "ETH/USD",
					},
					{
						id: "DOGE-USD",
						display_name: "DOGE/USD",
					},
				]
			}
		},

		methods: {
			viewAsset(exchange, product_id) {
				router.push({
					name: 'asset',
					params: {
						exchange: exchange,
						product_id: product_id,
						timeframe: '1m',
						candlecount: '100'
					}
				})
			},

			async getPageData() {
				this.loading = true
				try {
					this.reqData = await PageService.s_search(
						this.$route.params.query,
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

			async getPageDataLocally() {
				this.loading = true

				this.coinbaseResults = (await coinbaseAPI.searchProducts({
					query: this.$route.params.query,
				})).results

				this.loading = false
			},

			refreshRoute() {
				// [REDIRECT] Cat Page //
				router.push({
					name: 'search',
					params: {
						query: this.$route.params.query,
						tab: this.$route.params.tab,
						type: this.type,
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
				if (this.$route.params.query) {
					router.push({
						name: 'search',
						params: {
							query: this.$route.params.query,
							tab: 1,
							type: type,
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

		async created() {
			await this.getPageData()
			
			await this.getPageDataLocally()

			this.log()
		},
	}
</script>

<style lang="scss" scoped>
	.result-option {
		:hover {
			background-color: rgba(255, 255, 255, 0.171) !important;
		}
	}
</style>