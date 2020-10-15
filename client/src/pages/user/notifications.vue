<template>
	<div class="container">
		<div class="row mt-3 text-light">
			<div class="col">
				<div class="card card-body bg-dark">
					<h4>Notifications</h4>
					<b-card
						v-for="notification in notifications"
						:key="notification._id"
						class="bg-secondary my-1"
					>
						<p class="m-0">Seen by you: {{ notification.read }}</p>
						<p class="m-0">Type: {{ notification.type }}</p>
						<p class="m-0">Type: {{ notification.comment.text }}</p>
						<p class="m-0">Created:
							{{ new Date(notification.createdAt).toLocaleString() }}
						</p>

					</b-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PageService from '../../services/PageService'

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