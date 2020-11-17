<template>
	<div class="container">
		<div class="row mt-3 text-light">
			<div class="col">
				<div class="card card-body bg-dark">
					<h4>Notifications</h4>
					<BCard
						v-for="notification in notifications"
						:key="notification._id"
						class="my-1 bg-dark border-secondary"
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
					</BCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import PageService from '../../services/PageService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				returned: {},
				notifications: [],
			}
		},

		created: async function() {
			this.returned = await PageService.s_user_notifications(100, 0)

			this.notifications = this.returned.notifications
		}	
	}
</script>