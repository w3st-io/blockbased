<template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-6 col-md-8 col-sm-8">
			<!-- Title -->
			<h3 class="text-light">{{ catTitle }}</h3>

			<!-- Page Nav Buttons -->
			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-lg-6 col-md-4 col-sm-4 mb-3 text-right">
			<div class="mb-2 badge badge-light text-primary">
				<h5 class="m-0">Total Posts: {{ '--' }}</h5>
			</div>
			<br>

			<!-- Create Button -->
			<button
				@click="redirectToCatBlockCreate(cat_id)"
				class="btn btn-primary"
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
			catTitle: { type: String, required: true, },
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