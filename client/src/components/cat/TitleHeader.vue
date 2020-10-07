<template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-6 col-md-8 col-sm-8">
			<!-- Title -->
			<h3 class="text-light">{{ cat.title }}</h3>

			<!-- Page Nav Buttons -->
			<PageNavButtons
				@prev-btn="prev()"
				@next-btn="next()"
				:badgeValue="badgeValue"
				style="max-width: 300px;"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-lg-6 col-md-4 col-sm-4 mb-3 text-right">
			<!-- Post Count -->
			<div class="mb-2 badge badge-dark text-secondary">
				<h5 class="m-0">Total Posts: {{ postCount }}</h5>
			</div>
			<br>

			<!-- Create Button -->
			<button
				@click="redirectToCatPostCreate()"
				class="btn btn-sm btn-primary"
			>Create Post</button>
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
			cat: { type: Object, required: true, },
			postCount: { type: Number, default: 0},
			badgeValue: { required: true, },
		},

		components: {
			PageNavButtons,
		},

		methods: {
			prev() { this.$emit('prev-btn') },

			next() { this.$emit('next-btn') },
			
			redirectToCatPostCreate() {
				router.push({
					name: 'post-create',
					params: { cat_id: this.cat.cat_id }
				})
			},
		}
	}
</script>