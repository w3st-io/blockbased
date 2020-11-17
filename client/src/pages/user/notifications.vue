<template>
	<div class="container">
		<div class="row mt-3">
			<div class="col-12">
				<div class="card card-body bg-dark text-light">
					<h4>Notifications</h4>

					<!-- Page Control -->
					<section class="mt-3">
						<PageNavButtons
							@start-btn="startPage()"
							@prev-btn="prevPage()"
							@next-btn="nextPage()"
							@end-btn="endPage()"
							:badgeValue="page"
							class="w-100"
							style="max-width: 300px;"
						/>
					</section>

					<!-- Main -->
					<div class="row mt-3">
						<div class="col-12">
							<BCard
								v-for="notification in notifications"
								:key="notification._id"
								no-body
								class="mb-2 p-2 bg-dark border-secondary"
							>
								<a
									@click="
										clicked(notification._id, notification.comment.post._id)
									"
								>
									<div class="row text-secondary">
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
											{{ new Date(notification.createdAt).toLocaleString() }}
										</small>

										<!-- Text -->
										<p v-html="notification.comment.text" class="col-12 m-0"></p>
									</div>
								</a>
							</BCard>
						</div>
					</div>

					<!-- [LOADING] -->
					<section v-show="loading" class="row mt-3">
						<div class="col-12">
							<Alert />
						</div>
					</section>

					<!-- [ALERTS] -->
					<section v-show="error" class="row mt-3">
						<div class="col-12">
							<Alert BSColor="danger" :message="'Activity Page: ' + error" />
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
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
					this.data = await PageService.s_user_notifications(100, 0)
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