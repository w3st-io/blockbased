<template>
	<BContainer>
		<BRow class="mt-3">
			<BCol cols="12">
				<BCard bg-variant="dark" class="text-light">
					<BRow>
						<BCol cols="6"><h4>All Activity</h4></BCol>
						<BCol cols="6">
							<!-- Page Control -->
							<PageNavButtons
								@start-btn="startPage()"
								@prev-btn="prevPage()"
								@next-btn="nextPage()"
								@end-btn="endPage()"
								:badgeValue="page"
								class="w-100 ml-auto"
								style="max-width: 300px;"
							/>
						</BCol>
					</BRow>

					<BRow class="mt-3">
						<BCol cols="12">
							<!-- Main -->
							<BListGroup>
								<li
									v-for="activity in activities"
									:key="activity._id"
									class="card card-body mb-2 border-secondary bg-dark"
								>
									<BRow>
										<BCol cols="sm-8">
											<!-- Created User -->
											<BRow
												v-if="activity.type == 'user'"
												class="text-success"
											>
												<BCol class="m-0 p-0" style="max-width: 35px;">
													<img
														:src="activity.created_user.profileImg"
														class="w-100"
													>
												</BCol>
												<BCol>
													<h5>
														{{ activity.created_user.username }}
														joined the site!
													</h5>
												</BCol>
											</BRow>

											<!-- Created Post -->
											<BRow
												v-if="activity.type == 'post'"
												class="row text-primary"
											>
												<BCol class="m-0 p-0" style="max-width: 35px;">
													<img
														:src="activity.user.profileImg"
														class="w-100"
													>
												</BCol>
												<BCol>
													<h5>
														{{ activity.user.username }}
														created post: 
														{{ activity.created_post.title }}
													</h5>
												</BCol>
											</BRow>
											
											<!-- Created Comment -->
											<BRow
												v-if="activity.type == 'comment'"
												class="text-light"
											>
												<BCol class="m-0 p-0" style="max-width: 35px;">
													<img
														:src="activity.user.profileImg"
														class="w-100"
													>
												</BCol>
												<BCol>
													<h5>
														{{ activity.user.username }}
														created a comment in
														{{ activity.post.title }}
													</h5>
												</BCol>
											</BRow>
										</BCol>

										<!-- Timestamp -->
										<BCol cols="sm-4" class="text-right text-secondary">
											{{ new Date(activity.created_at).toLocaleString() }}
										</BCol>
									</BRow>
								</li>
							</BListGroup>
						</BCol>
					</BRow>

					<BRow v-show="error" class="mt-3">
						<BCol cols="12">
							<!-- [ALERTS] -->
							<Alert variant="danger" :message="'Activity Page: ' + error" />
						</BCol>
					</BRow>

					<BRow v-show="loading" class="mt-3">
						<BCol class="12">
							<!-- [LOADING] -->
							<Alert variant="dark" />
						</BCol>
					</BRow>
				</BCard>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import pageService from '@services/PageService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			PageNavButtons,
		},

		data: function() {
			return {
				sort: parseInt(this.$route.params.sort),
				limit: parseInt(this.$route.params.limit),
				page: parseInt(this.$route.params.page),
				loading: true,
				data: {},
				activities: [],
				error: '',
			}
		},

		created: async function() {
			await this.getPageData()

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

				if (this.data.status) { this.activities = this.data.activities }
				else { this.error = this.data.message }

				this.loading = false
			},

			log() {
				console.log('%%% [PAGE] /activity %%%')
				console.log('limit:', this.limit)
				console.log('page:', this.page)
				console.log('data:', this.data)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>