<template>
	<BContainer class="mt-3">
		<BRow class="mt-3">
			<BCol cols="12">
				<BCard bg-variant="dark" class="text-light">
					<BRow class="mt-3">
						<BCol cols="6">
							<h4>Your Activity</h4>
						</BCol>

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
							<ActivityList :activities="activities" />
						</BCol>
					</BRow>

					<BRow v-show="error" class="mt-3">
						<BCol cols="12">
							<!-- Error -->
							<Alert variant="danger" :message="'Activity Page: ' + error" />
						</BCol>
					</BRow>

					<BRow v-show="loading" class="mt-3">
						<BCol class="12">
							<!-- Loading -->
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
	import ActivityList from '@components/activity/List'
	import PageNavButtons from '@components/controls/PageNavButtons'
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import pageService from '@services/PageService'

	export default {
		components: {
			ActivityList,
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
				if (this.page < this.data.totalPages) {
					this.loading = true
					this.page++

					this.refreshRoute()

					await this.getPageData()
				}
			},

			async endPage() {
				if (this.page != this.data.totalPages) {
					this.loading = true
					this.page = this.data.totalPages

					this.refreshRoute()

					await this.getPageData()
				}
			},

			refreshRoute() {
				router.push({
					name: 'user_activity',
					params: {
						sort: this.sort,
						limit: this.limit,
						page: this.page,
					}
				})
			},

			async getPageData() {
				try {
					this.data = await pageService.s_user_activity(
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
				console.log('%%% [PAGE] /user/activity %%%')
				console.log('limit:', this.limit)
				console.log('page:', this.page)
				console.log('data:', this.data)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>