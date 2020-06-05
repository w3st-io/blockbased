<template>
	<section class="mb-3 flex-container w-100">
		<div class="w-50 float-left">
			<h2 class="text-light">{{ cat_id }}</h2>
		</div>
		<div class="w-50 float-right text-right">
			<button
				@click="redirectToCatBlockCreate(cat_id)"
				class="btn btn-info">
			Create Block</button>
		</div>
		<br>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		props: {
			cat_id: {
				type: String,
				required: true
			}
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