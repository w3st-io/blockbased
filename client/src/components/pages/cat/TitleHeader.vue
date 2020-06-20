<template>
	<section class="w-100 mb-3 flex-container">
		<!-- Left Side -->
		<div class="w-50 float-left">
			<!-- Title -->
			<h3 class="text-light">{{ cat_id }}</h3>

			<div class="w-50">
				<!-- Page Nav Buttons -->
				<page-nav-buttons
					:leftBtnEmitName="leftBtnEmitName"
					:rightBtnEmitName="rightBtnEmitName"
					:badgeValue="badgeValue"
				/>
			</div>
		</div>

		<!-- Right Side -->
		<div class="w-50 float-right text-right">
			<div class="mb-2 badge badge-light text-info">
				<h5 class="m-0">Total Posts: {{ totalCount = 3 }}</h5>
			</div>
			<br>

			<!-- Create Button -->
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
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			cat_id: {
				type: String,
				required: true
			},

			badgeValue: {
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
		},

		components: {
			PageNavButtons,
		},

		methods: {
			redirectToCatBlockCreate(cat_id) {
				router.push({ name: 'BlockCreate', params: { cat_id: cat_id } })
			},
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