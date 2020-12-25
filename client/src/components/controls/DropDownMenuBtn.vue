<template>
	<span> 
		<BButton
			:variant="variant"
			size="sm"
			class="position-relative dropdown-toggle z-index-button"
			@click="showPopper = !showPopper"
		>
			<img v-if="btnImage" :src="btnImage" alt="No Img">
			<span v-if="btnName">{{ btnName }}</span>
		</BButton>

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
				class="dropdown-item bg-dark text-light"
				@click="
					emit(listItem)
					showPopper = !showPopper
				"
			>{{ listItem }}</a>
		</div>
	</span>
</template>
 
<script>
	// [IMPORT] //
	import ClickOutside from 'vue-click-outside'
 
	// [EXPORT] //
	export default {
		props: {
			_id: {type: String, required: true, },
			list: { type: Array, required: true },
			btnName: { type: String, },
			btnImage: { type: String, },
			variant: { type: String, default: 'light' },
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
			emit(listItem) { this.$emit('ddmb-clicked', listItem, this._id) },

			outsideClicked() { this.showPopper = false },

			log() {
				console.log('%%% [COMPONENT] dropDownMenuBtn %%%')
				console.log('_id:', this._id)
				console.log('list:', this.list)
				console.log('btnName:', this.btnName)
				console.log('variant:', this.variant)
			}
		},

		directives: { ClickOutside }
	}
</script>

<style scoped>
	.z-index-button { z-index: 1001 !important; }

	.z-index-menu { z-index: 1000 !important; }
</style>