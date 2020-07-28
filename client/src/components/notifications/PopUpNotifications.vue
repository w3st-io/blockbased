<template>
	<transition-group
		name="fade"
		tag="div"
		class="d-flex flex-wrap fixed-bottom my-3 mr-4 ml-auto"
	>
		<div
			v-for="(notification, index) in notifications"
			:key="index"
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
					{{ notification.comment.user.username }} made a {{ notification.type }}
				</span>
				<button type="button" class="ml-2 mb-1 close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="card-body p-2">
				<p class="card-text small">
					{{ notification.comment.text }}
				</p>
			</div>
		</div>
	</transition-group>
</template>

<script>
	// [IMPORT] //
	import NotificationService from '../../services/NotificationService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				notifications: [],
			}
		},

		created: async function() {
			this.notifications = await NotificationService.readAll()

			this.refreshNotifications()

			// [LOG] //
			this.log()
		},

		methods: {
			refreshNotifications() {
				setTimeout(() => this.notifications.push('new notification'), 5000)
			},
		
			log() {
				console.log('%%% [COMPONENT] PopUpNotifications %%%')
				console.log('nothifications:', this.notifications)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.fade-in {
		opacity: 1;
		animation-name: fadeInOpacity;
		animation-iteration-count: 1;
		animation-timing-function: ease-in;
		animation-duration: 1s;
	}

	@keyframes fadeInOpacity {
		0% { opacity: 0; }
		100% { opacity: 1; }
	}
</style>