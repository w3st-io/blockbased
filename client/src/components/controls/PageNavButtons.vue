<template>
	<div class="py-2">
		<div class="w-50 btn-group flaot-right">
			<button
				@click="leftBtn()"
				class="w-25 btn btn-sm btn-outline-light"
			>Prev</button>
			<button
				@click="rightBtn()"
				class="w-25 btn btn-sm btn-outline-light"
			>Next</button>
		</div>
		<span class="mx-2 p-2 badge badge-light">
			{{ badgeValue }}
		</span>
	</div>
</template>

<script>
	// [IMPORT] //
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		props: {
			leftBtnEmitName: {
				type: String,
				required: true
			},
			rightBtnEmitName: {
				type: String,
				required: true
			},
			badgeValue: {
				type: String,
				required: true
			}
		},

		created() { this.log() },

		methods: {
			log() {
				console.log('%% Page Nav Button Component %%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},

			leftBtn() {
				EventBus.$emit(this.leftBtnEmitName)
			},

			rightBtn() {
				EventBus.$emit(this.rightBtnEmitName)
			},
		}
	}
</script>