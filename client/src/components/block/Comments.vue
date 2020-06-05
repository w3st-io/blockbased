<template>
	<section>
		<article
			v-for="commentDetail in commentDetails"
			:key="commentDetail._id"
			class="mb-2"
		>
			<div class="d-flex py-2 bg-dark border border-secondary rounded-top">
				<!-- Image Section -->
				<div class="float-left px-3 py-1 border-right border-secondary" style="width: 15%;">
					<img src="../../assets/images/placeholder.png" class="w-100 rounded-lg">
					<p class="m-0 text-center text-light">{{ commentDetail.email }}</p>
				</div>

				<!-- Comment Section -->
				<div class="float-right p-2" style="width: 85%; flex-grow: 1;">
					<p class="m-0 text-light">{{ commentDetail.comment }}</p>
				</div>
			</div>
			<div class="w-100 p-1 bg-dark border border-top-0 border-secondary rounded-bottom">{{ commentDetail._id }}</div>
		</article>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/

	/*** [EXPORT] ***/
	export default {
		props: {
			commentDetails: {
				type: Array,
				required: true
			}
		},
	}
</script>

<style scoped>
</style>