<template>
	<ul class="w-100 m-0 px-0 border border-secondary">
		<li
			v-for="(cat, index) in cats"
			:key="index"
			class="m-0 bg-dark row"
		>
			
			<!-- Image Section -->
			<div
				@click="redirectToCatBlocks(cat.cat_id)"
				class="
					col-lg-1
					col-md-2
					col-sm-2
					col-2
					p-2
					align-self-center
				"
			>
				<div class="w-100 overflow-auto rounded-circle">
					<img
						v-bind:src="require('../../assets/images/caticons/' + cat.image)"
						class="w-100 bg-info img-padding"
					>
				</div>
			</div>

			<!-- Title -->
			<div
				@click="redirectToCatBlocks(cat.cat_id)"
				class="
					col-lg-9
					col-md-8
					col-sm-8
					col-8
					py-3
				"
			>
				<h4 class="text-light">{{ cat.title }}</h4>
				<p class="m-0 text-light hidden-768">{{ cat.description }}</p>
			</div>

			<!-- Count -->
			<div
				@click="redirectToCatBlocks(cat.cat_id)"
				class="
					col-lg-2
					col-md-2
					col-sm-2
					col-2
					p-3
					text-right
					hidden-768
				"
			>
				<p class="badge badge-info text-light">
					<span class="m-0 custom-font-size">
						<p v-if="!loading" class="m-0">
							{{ totals[cat.cat_id] }}
						</p>
						<span class="small">Posts</span>
					</span>
				</p>
			</div>
		</li>
	</ul>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import BlockService from '@services/BlockService'

	// [EXPORT] //
	export default {
		props: {
			cats: { type: Array, required: true, },
		},

		data: function() {
			return {
				loading: true,
				totals: {},
			}
		},

		created: async function() {
			// Get Totals //
			for (let i = 0; i < this.cats.length; i++) {
				this.totals[this.cats[i].cat_id] = await this.totalBlocks(
					this.cats[i].cat_id
				)
			}

			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			async totalBlocks(cat_id) {
				let count = await BlockService.countBlocksForCat(cat_id)

				return count
			},

			redirectToCatBlocks(cat_id) {
				// Push to Cat Page
				router.push({ name: 'Cat', params: { cat_id: cat_id, page: 1 } })
			},

			log() {
				console.log('totals', this.totals)
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/bootstrap-override.scss';
	@import 'src/assets/styles/sass-variables.scss';


	li {
		@extend .bg-dark;
		&:hover { @extend .bg-info; }
	}
	li:nth-child(even) {
		background: $grey;
		&:hover { @extend .bg-info; }
	}

	.custom-font-size { font-size: 16px; }

	.img-padding { padding: 20%; }

	@media screen and (max-width: 768px) {
		.not-hidden-768 { width: 100%; }
		.hidden-768 { display: none !important; }
	}
</style>