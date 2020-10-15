<template>
	<section class="d-flex flex-column-reverse fixed-bottom my-3 mr-4 ml-auto">
		<!-- Show Button -->
		<button
			@click="userShowClicked()"
			class="w-25 ml-auto btn btn-primary"
		>Show</button>
		
		<div
			v-show="show || userShow"
			v-for="notification in notifications"
			:key="notification._id"
			class="
				card
				card-sm
				flex-card
				w-100
				mb-3
				text-light
				bg-primary
				border-primary
				shadow
				fade-in
			"
		>
			<div class="card-header p-2">
				<span class="small">
					{{ notification.comment.post.title }}
				</span>
				<button
					@click="closeClicked(notification._id)"
					type="button"
					class="ml-2 mb-1 close"
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="card-body p-2">
				<p class="card-text small">
					{{ notification.comment.user.username }}
					posted a
					{{ notification.type }}
					{{ notification.comment.text }}
				</p>
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import NotificationService from '@services/NotificationService'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				show: true,
				userShow: false,
				notifications: [],
			}
		},

		created: async function() {
			// [UPDATE] //
			await this.readAllUnreadNotifications()

			// [ON-EVENTBUS] //
			EventBus.$on('update-notification', () => {
				this.readAllUnreadNotifications()
			})

			// [LOG] //
			//this.log()
		},

		methods: {
			async readAllUnreadNotifications() {
				this.show = true

				this.notifications = await NotificationService.s_readAllUnread()

				// Wait 3 seconds
				setTimeout(() => { this.show = false }, 5000)
			},

			closeClicked(notification_id) {
				NotificationService.markRead(notification_id)

				// [UPDATE] //
				EventBus.$emit('update-notification')
			},

			userShowClicked() { this.userShow = !this.userShow },
		
			log() {
				console.log('%%% [COMPONENT] PopUpNotifications %%%')
				console.log('nothifications:', this.notifications)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.fade-in {
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-iteration-count: 1;
		animation-timing-function: ease-in;
		animation-duration: .5s;
	}

	@keyframes fadeInOpacity {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>