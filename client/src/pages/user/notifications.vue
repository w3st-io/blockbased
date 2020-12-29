<template>
	<BContainer>
		<BRow class="mt-3">
			<BCol cols="12">
				<BCard bg-variant="dark" class="text-light">
					<BRow>
						<!-- Title -->
						<BCol cols="12" sm="5" md="6" lg="8">
							<h4>Notifications</h4>
						</BCol>

						<!-- Page Control -->
						<BCol cols="12" sm="7" md="6" lg="4">
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

					<!-- Main -->
					<BRow class="mt-3">
						<BCol cols="12">
							<BCard
								v-for="notification in notifications"
								:key="notification._id"
								no-body
								bg-variant="dark"
								border-variant="secondary"
								class="mb-2 p-2"
							>
								<a
									@click="clicked(
										notification._id,
										notification.comment.post._id
									)"
								>
									<BRow class="text-secondary">
										<!-- Header -->
										<h5
											class="col-md-10 m-0"
											:class="{
												'font-weight-bold text-light': !notification.read,
											}"
										>
											<span v-if ="!notification.read" class="text-primary">
												&#9679;
											</span>
											{{ notification.comment.user.username }} made a 
											{{ notification.type }} in 
											{{ notification.comment.post.title }}
										</h5>

										<!-- Timestamp -->
										<small class="col-md-2">
											{{ new Date(notification.created_at).toLocaleString() }}
										</small>

										<!-- Text -->
										<p v-html="notification.comment.text" class="col-12 m-0"></p>
									</BRow>
								</a>
							</BCard>
						</BCol>
					</BRow>

					<!-- [LOADING] -->
					<BRow v-show="loading" class="mt-3">
						<BCol cols="12"><Alert /></BCol>
					</BRow>

					<!-- [ALERTS] -->
					<BRow v-show="error" class="mt-3">
						<BCol cols="12">
							<Alert variant="danger" :message="'Notification Page: ' + error" />
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
	import NotificationService from '@services/NotificationService'
	import PageService from '@services/PageService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		components: {
			Alert,
			PageNavButtons,
		},

		data: function() {
			return {
				loading: true,
				data: {},
				notifications: [],
				page: 0,
				error: '',
			}
		},

		created: async function() {
			await this.getPageData()
		},
		
		methods: {
			async getPageData() {
				try {
					this.data = await PageService.s_user_notifications(0, 100, 0)
				}
				catch (err) { this.error = `This: --> ${err}` }

				if (this.data.status) {
					this.notifications = this.data.notifications
				}
				else { this.error = this.data.message }

				this.loading = false
			},

			async clicked(notification_id, post_id) {
				// Mark Read
				NotificationService.markRead(notification_id)

				// [UPDATE] //
				EventBus.$emit('update-notification')

				// [REDIRECT] //
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 5,
						page: 1,
					}
				})
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