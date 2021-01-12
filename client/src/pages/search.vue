<template>
	<BContainer>
		<BRow class="mt-3 text-light">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<BRow>
						<BCol cols="12" class="mb-3">
							<h3 class="text-center">Search Results for {{ query }}</h3>
						</BCol>

						<BCol cols="3">
							<BNav class="flex-column nav-pills">
								<p
									class="m-0 nav-link"
									:class="{ active: type == 'posts' }"
									@click="searchPostsRedirect('posts')"
								>
									<span class="float-left">Posts</span>
									<BBadge variant="light" class="float-right">
										{{ reqData.postCount }}
									</BBadge>
								</p>
								<p
									class="m-0 nav-link"
									:class="{ active: type == 'users' }"
									@click="searchUsersRedirect('users')"
								>
									<span class="float-left">Users</span>
									<BBadge variant="light" class="float-right">
										{{ reqData.userCount }}
									</BBadge>
								</p>
							</BNav>
						</BCol>

						<BCol cols="9">
							<PostList
								v-if="!loading && type == 'posts'"
								:posts="posts"
								@refreshPosts="getPageData()"
							/>

							<UserList
								v-if="!loading && type == 'users'"
								:users="reqData.userResults"
							/>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import PostList from '@components/post/List'
	import UserList from '@components/user/List'
	import PageService from '@services/PageService'
	import router from '@router'
	import { EventBus } from '@main'

	export default {
		components: {
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
				users: [],
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
						this.users = this.reqData.userResults
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }

				this.loading = false
			},

			searchPostsRedirect() {
				if (this.query) {
					router.push({
						name: 'search',
						params: {
							type: 'posts',
							query: this.query,
							limit: 5,
							page: 1,
						}
					})
	
					EventBus.$emit('force-rerender')
				}
			},

			searchUsersRedirect() {
				if (this.query) {
					router.push({
						name: 'search',
						params: {
							type: 'users',
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