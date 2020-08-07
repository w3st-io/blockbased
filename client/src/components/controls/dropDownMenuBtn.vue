<template>
	<span> 
		<button
			@click="showPopper = !showPopper"
			:class="'btn-'+ BSColor"
			class="position-relative btn btn-sm dropdown-toggle z-index-button"
		>{{ btnName }}</button>

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
				v-for="(listItem, index) in list"
				:key="index"
				@click="
					emit(listItem, _id);
					showPopper = !showPopper;
				"
				class="dropdown-item bg-dark text-light"
			>{{ listItem }}</a>
		</div>
	</span>
</template>
 
<script>
	// [IMPORT] //
	import ClickOutside from 'vue-click-outside'

	// [IMPORT] Personal //
	import { EventBus } from '@main'
 
	// [EXPORT] //
	export default {

		props: {
			_id: {type: String, required: true, },
			list: { type: Array, required: true },
			btnName: { type: String, default: 'DDMB' },
			BSColor: { type: String, default: 'light' },
		},

		data: function() {
			return {
				showPopper: false,
			}
		},

		mounted: function() {
			// prevent click outside event with popupItem.
			this.popupItem = this.$el
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			emit(listItem, _id) { EventBus.$emit(listItem, _id) },

			outsideClicked() { this.showPopper = false },

			log() {
				console.log('%%% [COMPONENT] dropDownMenuBtn %%%')
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