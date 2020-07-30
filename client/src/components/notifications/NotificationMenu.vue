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
			<img
				:src="require('../../assets/images/icons/bell.svg')"
				style="width: 16px;"
			>
			<span v-if="notifications" class="ml-1 badge badge-danger">
				{{ totalNotifications }}
			</span>
		</button>

		<div
			v-show="showPopper"
			v-click-outside="outsideClicked"
			class="
				position-absolute
				p-1
				bg-dark
				border
				border-secondary
				shadow
				rounded
				z-index-menu
			"
		>
			<a
				v-for="(listItem, index) in notifications"
				:key="index"
				@click="
					emit(listItem, _id);
					showPopper = !showPopper;
				"
				class="dropdown-item bg-dark text-light"
			>
				{{ listItem.comment.user.username }} made a {{ listItem.type }}
				in block {{ listItem.comment.block }}
			</a>
		</div>
	</span>
</template>
 
<script>
	// [IMPORT] //
	import ClickOutside from 'vue-click-outside'

	// [IMPORT] Personal //
	import NotificationService from '@services/NotificationService'
	import { EventBus } from '@main'
 
	// [EXPORT] //
	export default {
		data: function() {
			return {
				showPopper: false,
				notifications: [],
				list: ['s','f']
			}
		},

		mounted: function() {
			// prevent click outside event with popupItem.
			this.popupItem = this.$el
		},

		created: async function() {
			// [UPDATE] //
			await this.readAllNotifications()

			// [LOG] //
			//this.log()
		},

		methods: {
			async readAllNotifications() {
				this.notifications = await NotificationService.readAll()
			},

			emit(listItem, _id) { EventBus.$emit(listItem, _id) },

			outsideClicked() { this.showPopper = false },

			log() {
				console.log('%%% [COMPONENT] NotificationMenu %%%')
				console.log('_id:', this._id)
				console.log('list:', this.list)
				console.log('btnName:', this.btnName)
				console.log('BSColor:', this.BSColor)
			}
		},

		directives: {
			ClickOutside
		}
	}
</script>

<style scoped>
	.z-index-button { z-index: 1001 !important; }

	.z-index-menu { z-index: 1000 !important; }
</style>