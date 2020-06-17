<template>
	<div class="w-100 py-2 flex-container">
		<div class="flaot-left w-75 btn-group">
			<button
				@click="leftBtn()"
				class=" btn btn-sm btn-outline-light"
			>Prev</button>
			<button
				@click="rightBtn()"
				class="btn btn-sm btn-outline-light"
			>Next</button>
		</div>
		<div class="flaot-right w-25 px-2 text-center">
			<h6 class="h-100 mx-1 my-0 p-2 rounded bg-light">
				{{ badgeValue }}
			</h6>
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
				EventBus.$emit(this.leftBtnEmitName)
			},

			rightBtn() {
				EventBus.$emit(this.rightBtnEmitName)
			},

			log() {
				console.log('%%% [COMPONENT] Page Nav Button %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>

<style>
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: unset;
	}
</style>