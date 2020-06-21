<template>
	<nav class="w-100 m-0">
		<ul class="pagination">
			<!-- Left -->
			<li class="w-25 page-item text-center">
				<a @click="leftBtn()" class="page-link text-light bg-dark">Prev</a>
			</li>

			<!-- Page Number -->
			<li class="page-item">
				<a class="page-link">{{ badgeValue }}</a>
			</li>

			<!-- Right -->
			<li class="w-25 page-item text-center">
				<a @click="rightBtn()" class="page-link text-light bg-dark">Next</a>
			</li>
		</ul>
	</nav>
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
				console.log('%%% [COMPONENT] PageNavButtons %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>