<template>
	<article class="container">
		<div class="row mt-3">
			<div class="col-12">
				<div class="card card-body bg-dark text-light">
					<h4>All Activity</h4>
					<ul class="list-group">
						<li
							v-for="activity in data.activities"
							:key="activity._id"
							class="list-group-item bg-dark"
						>
							<div class="row">
								<!-- Details Section -->
								<div class="col-sm-8">
									<!-- Created User -->
									<div v-if="activity.type == 'user'" class="row text-success">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.user.username }} joined the site!
										</h5>
									</div>

									<!-- Created Post -->
									<div v-if="activity.type == 'post'" class="row text-primary">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.post.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.post.user.username }}
											created post: 
											{{ activity.post.title }}
										</h5>
									</div>
									
									<!-- Created Comment -->
									<div v-if="activity.type == 'comment'" class="row">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.comment.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.comment.user.username }}
											created a comment in
											{{ activity.comment.post.title }}
										</h5>
									</div>
								</div>

								<!-- Timestamp -->
								<div class="col-sm-4 text-right text-secondary">
									{{ new Date(activity.createdAt).toLocaleString() }}
								</div>
							</div>
						</li>
					</ul>

					<!-- [ALERTS] -->
					<section v-show="error" class="row mt-3">
						<div class="col-12">
							<Alert BSColor="danger" :message="'Activity Page: ' + error" />
						</div>
					</section>

					<!-- [LOADING] -->
					<section v-show="loading" class="row mt-3">
						<div class="col-12">
							<Alert BSColor="dark" />
						</div>
					</section>
				</div>
			</div>
		</div>
	</article>
</template>

<script>
	// [IMPORT] //
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import pageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert
		},

		data: function() {
			return {
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				data: {},
				error: '',
			}
		},

		created: async function() {
			this.getPageData()

			this.log()
		},

		methods: {
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
					name: 'activity',
					params: {
						sort: this.sort,
						limit: this.limit,
						page: this.page,
					}
				})
			},

			async getPageData() {
				try {
					this.data = await pageService.s_activity(
						this.sort,
						this.limit,
						this.page
					)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) { this.posts = this.data.posts }
				else { this.error = this.data.message }

				this.loading = false
			},

			log() {
				console.log('%%% [PAGE] activity %%%')
				console.log('limit:', this.limit)
				console.log('page:', this.page)
				console.log('data:', this.data)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>