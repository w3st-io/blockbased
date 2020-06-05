<template>
	<ul class="w-100 m-0 px-0 border border-secondary">
		<li
			v-for="(cat, index) in cats"
			:key="index"
			class="m-0 bg-dark"
		>
			<article
				@click="redirectToCatBlocks(cat.cat_id)"
				class="d-inline-block w-100"
			>
				<!-- Image Section -->
				<div class="px-2 pt-3 float-left" style="width: 10%;">
					<img
						src="../../assets/images/placeholder.jpg"
						class="w-100 border border-secondary rounded-circle"
					>
				</div>

				<!-- Title -->
				<div class="px-1 py-3 float-right" style="width: 90%;">
					<h4 class="text-light">{{ cat.title }}</h4>
					<p class="m-0 text-light">{{ cat.description }}</p>
				</div>
			</article>
		</li>
	</ul>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import router from '../../router'

	/*** [EXPORT] ***/
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
				router.push({ name: 'Cat', params: { cat_id: cat_id } })
			}
		}
	}
</script>

<style scoped>
	li { list-style: none; }

	li { background: #343a40 !important; }
	li:nth-child(even) { background: #42484e !important; }

	li:hover { background: rgb(67, 72, 117) !important; }
	li:nth-child(even):hover { background: rgb(67, 72, 117) !important; }
</style>