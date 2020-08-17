<template>
	<ul class="pagination w-100 m-0">
		<!-- Left -->
		<li class="page-item text-center" style="width: 35%;">
			<a @click="leftBtn()" class="p-1 page-link text-light bg-dark">⟵</a>
		</li>

		<!-- Page Number -->
		<li class="page-item text-center" style="width: 30%;">
			<a class="p-1 page-link text-light bg-dark">{{ badgeValue }}</a>
		</li>

		<!-- Right -->
		<li class="page-item text-center" style="width: 35%;">
			<a @click="rightBtn()" class="p-1 page-link text-light bg-dark">⟶</a>
		</li>
	</ul>
</template>

<script>
	// [IMPORT] //
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		props: {
			leftBtnEmitName: { type: String, required: true, },
			rightBtnEmitName: { type: String, required: true, },
			badgeValue: { type: Number, required: true, },
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			leftBtn() { EventBus.$emit(this.leftBtnEmitName) },

			rightBtn() { EventBus.$emit(this.rightBtnEmitName) },

			log() {
				console.log('%%% [COMPONENT] PageNavButtons %%%')
				console.log('leftBtnEmitName:', this.leftBtnEmitName)
				console.log('rightBtnEmitName:', this.rightBtnEmitName)
				console.log('badgeValue:', this.badgeValue)
			},
		},
	}
</script>