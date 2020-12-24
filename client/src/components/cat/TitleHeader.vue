<template>
	<BRow>
		<!-- Left Side -->
		<BCol sm="8" md="8" lg="6">
			<!-- Title -->
			<h3 class="text-light">{{ cat.title }}</h3>

			<!-- Create Button -->
			<BButton
				variant="primary"
				size="sm"
				@click="redirectToCatPostCreate()"
			>Create Post</BButton>
		</BCol>

		<!-- Right Side -->
		<BCol sm="4" md="4" lg="6" class="mb-3 text-right">
			<!-- Post Count -->
			<BBadge variant="dark" class="mb-2 text-secondary">
				<h5 class="m-0">Total Posts: {{ postCount }}</h5>
			</BBadge>
			<br>

			<!-- Page Nav Buttons -->
			<PageNavButtons
				@start-btn="start()"
				@prev-btn="prev()"
				@next-btn="next()"
				@end-btn="end()"
				:badgeValue="badgeValue"
				class="ml-auto"
				style="max-width: 300px;"
			/>
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'

	// [EXPORT] //
	export default {
		props: {
			cat: { type: Object, required: true, },
			postCount: { type: Number, default: 0 },
			badgeValue: { required: true, },
		},

		components: {
			PageNavButtons,
		},

		methods: {
			start() { this.$emit('start-btn') },

			prev() { this.$emit('prev-btn') },

			next() { this.$emit('next-btn') },

			end() { this.$emit('end-btn') },
			
			redirectToCatPostCreate() {
				router.push({
					name: 'post-create',
					params: { cat_id: this.cat.cat_id }
				})
			},
		}
	}
</script>