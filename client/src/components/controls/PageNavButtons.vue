<template>
	<nav class="w-100 m-0">
		<ul class="pagination">
			<!-- Left -->
			<li class="page-item text-center" style="width: 64px;">
				<a @click="leftBtn()" class="page-link text-light bg-info">Prev</a>
			</li>

			<!-- Page Number -->
			<li class="page-item">
				<a class="page-link text-light bg-info">{{ badgeValue }}</a>
			</li>

			<!-- Right -->
			<li class="page-item text-center" style="width: 64px;">
				<a @click="rightBtn()" class="page-link text-light bg-info">Next</a>
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