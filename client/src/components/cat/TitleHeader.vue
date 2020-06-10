<template>
	<section class="w-100 mb-3 flex-container">
		<!-- Left Side -->
		<div class="w-50 float-left">
			<!-- Title -->
			<h3 class="text-light">
				{{ cat_id }}
			</h3>

			<!-- Page Nav Control -->
			<pageNavButtons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="w-50 float-right text-right">
			<button
				@click="redirectToCatBlockCreate(cat_id)"
				class="btn btn-info"
			>Create Block</button>
		</div>
		<br>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import pageNavButtons from '../controls/PageNavButtons'
	import router from '../../router'

	// [EXPORT] //
	export default {
		props: {
			cat_id: {
				type: String,
				required: true
			},

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
			},
		},

		components: {
			pageNavButtons,
		},

		methods: {
			redirectToCatBlockCreate(cat_id) {
				router.push({ name: 'CatBlockCreate', params: { cat_id: cat_id } })
			}
		}
	}
</script>

<style scoped>
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: unset;
	}
</style>