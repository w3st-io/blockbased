<template>
	<ul class="w-100 m-0 px-0 border border-secondary">
		<li
			v-for="(cat, index) in cats"
			:key="index"
			class="m-0 bg-dark list-group"
		>
			<article
				@click="redirectToCatBlocks(cat.cat_id)"
				class="w-100 d-inline-block"
			>
				<!-- Image Section -->
				<div class="px-2 pt-3 float-left border-circle" style="width: 10%;">
					<div class="w-100 d-inline-block overflow-auto rounded-circle">
						<img
							v-bind:src="require('../../../assets/images/caticons/' + cat.image)"
							class="w-100 bg-info img-padding"
						>
					</div>
				</div>

				<!-- Title -->
				<div class="px-1 py-3 float-right" style="width: 90%;">
					<div class="w-75 float-left not-hidden-768">
						<h4 class="text-light">{{ cat.title }}</h4>
						<p class="m-0 text-light">{{ cat.description }}</p>
					</div>
					<!-- Count -->
					<div class="w-25 float-left text-center hidden-768">
						<p class="badge badge-light text-info">
							<span class="m-0 custom-font-size">
								{{ totalBlocks = "--" }}<br>
								<span class="small">Posts</span>
							</span>
						</p>
					</div>
				</div>

				
			</article>
		</li>
	</ul>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			cats: {
				type: Array,
				required: true
			}
		},

		methods: {
			redirectToCatBlocks(cat_id) {
				// Push to Cat Page
				router.push({ name: 'Cat', params: { cat_id: cat_id, page: 1 } })
			}
		}
	}
</script>

<style lang="scss" scoped>
	// Import Bootstrap and Bootstrap Override //
	@import 'bootstrap/scss/bootstrap.scss';
	@import '../../../assets/styles/bootstrap-override.scss';

	li { @extend .bg-dark; }
	li:hover { @extend .bg-info; }
	li:nth-child(even) { background: $grey; }
	li:nth-child(even):hover { @extend .bg-info; }

	.custom-font-size { font-size: 16px; }

	.img-padding { padding: 20%; }

	@media screen and (max-width: 768px) {
		.not-hidden-768 { width: 100%; }
		.hidden-768 { display: none !important; }
	}
</style>