<template>
	<div class="container">
		<div class="row mt-3 text-light">
			<div class="col">
				<div class="card card-body bg-dark">
					<h4>Notifications</h4>
					<BCard
						v-for="notification in notifications"
						:key="notification._id"
						class="bg-secondary my-1"
					>
						<p class="m-0">Seen: {{ notification.read }}</p>
						<p class="m-0">Created:
							{{ new Date(notification.createdAt).toLocaleString() }}
						</p>
						<p v-html="notification.comment.text" class="m-0"></p>
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