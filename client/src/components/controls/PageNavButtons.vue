<template>
	<div class="w-100 h-100 py-2">
		<div class="float-left w-75 btn-group">
			<button
				@click="leftBtn()"
				class="btn btn-sm btn-outline-light"
			>Prev</button>
			<button
				@click="rightBtn()"
				class="btn btn-sm btn-outline-light"
			>Next</button>
		</div>
		<div class="float-right w-25 px-1">
			<p class="h-100 mx-1 my-0 badge badge-light">
				{{ badgeValue }}
			</p>
		</div>
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
				type: Number,
				required: true
			}
		},

		created() {
			// [LOG] //
			//this.log()
		},

		methods: {
			leftBtn() {
				console.log('leftBtnEmitName', this.leftBtnEmitName)
				EventBus.$emit(this.leftBtnEmitName)
			},

			rightBtn() {
				console.log('rightBtnEmitName', this.rightBtnEmitName)
				EventBus.$emit(this.rightBtnEmitName)
			},

			log() {
				console.log('%%% [COMPONENT] PageNavButtons %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>