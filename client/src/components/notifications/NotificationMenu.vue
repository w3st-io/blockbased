<template>
	<span> 
		<button
			@click="showPopper = !showPopper"
			class="
				position-relative
				btn
				btn-sm
				btn-outline-light 
				z-index-button
			"
		>
			<span v-if="notifications.length != 0" class="mr-1 badge badge-danger">
				{{ notifications.length }}
			</span>
			<img
				:src="require('../../assets/images/icons/bell.svg')"
				style="width: 16px;"
			>
		</button>

		<div
			v-show="showPopper"
			v-click-outside="outsideClicked"
			class="position-absolute mt-1 p-1 bg-dark shadow rounded z-index-menu"
			style="width: 100%; max-width: 300px;"
		>
			<a
				v-for="(notification, index) in notifications"
				:key="index"
				@click="
					clicked(notification._id, notification.comment.block._id);
					showPopper = !showPopper;
				"
				class="dropdown-item bg-primary text-light"
			>
				<h6 class="text-light">{{ notification.comment.block.title }}</h6>
				<p class="m-0">
					{{ notification.comment.user.username }} made a {{ notification.type }}
				</p>
				
			</a>
		</div>
	</span>
</template>
 
<script>
	// [IMPORT] //
	import ClickOutside from 'vue-click-outside'

	// [IMPORT] Personal //
	import router from '@router'
	import NotificationService from '@services/NotificationService'
	import { EventBus } from '@main'
 
	// [EXPORT] //
	export default {
		data: function() {
			return {
				showPopper: false,
				notifications: [],
			}
		},

		mounted: function() {
			// prevent click outside event with popupItem.
			this.popupItem = this.$el
		},

		created: async function() {
			// [UPDATE] //
			await this.readAllNotifications()

			// [--> EMIT IN] //
			EventBus.$on('notificationClicked', () => { this.readAllNotifications() })

			// [LOG] //
			//this.log()
		},

		methods: {
			async readAllNotifications() {
				this.notifications = await NotificationService.readAll()
			},

			async clicked(notification_id, block_id) {
				// Mark Read
				NotificationService.markRead(notification_id)

				// [UPDATE] //
				try { await this.readAllNotifications() }
				catch (e) { console.log(`Caught Error --> ${e}`) }

				EventBus.$emit('notificationClicked')

				// [REDIRECT] //
				router.push({
					name: 'Block',
					params: { block_id: block_id, page: 1 }
				})
			},

			outsideClicked() { this.showPopper = false },

			log() {
				console.log('%%% [COMPONENT] NotificationMenu %%%')
				console.log('_id:', this._id)
				console.log('list:', this.list)
				console.log('btnName:', this.btnName)
				console.log('BSColor:', this.BSColor)
			}
		},

		directives: { ClickOutside }
	}
</script>

<style scoped>
	.z-index-button { z-index: 1001 !important; }

	.z-index-menu { z-index: 1000 !important; }
</style>