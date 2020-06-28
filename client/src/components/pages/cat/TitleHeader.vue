<template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-8">
			<!-- Title -->
			<h3 class="text-light">{{ cat_id }}</h3>

			<!-- Page Nav Buttons -->
			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-4 text-right">
			<div class="mb-2 badge badge-light text-info">
				<h5 class="m-0">Total Posts: {{ '--' }}</h5>
			</div>
			<br>

			<!-- Create Button -->
			<button
				@click="redirectToCatBlockCreate(cat_id)"
				class="btn btn-info"
			>Create Block</button>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			cat_id: { type: String, required: true, },
			leftBtnEmitName: { type: String, required: true, },
			rightBtnEmitName: { type: String, required: true, },
			badgeValue: { required: true, },
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