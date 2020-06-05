<template>
	<section class="container">
		<article class="row">
			<!-- Title With Create Button -->
			<title-header :cat_id="cat_id" />

			<!-- Display All the Blocks -->
			<ul class="w-100 m-0 px-0 border border-secondary">
				<li
					class="m-0 bg-dark"
					v-for="(block, index) in blocks"
					:key="index"
				>
					<article
						class="d-inline-block w-100"
						@click="redirectToBlock(block._id)"
					>
						<!-- Title --> 
						<div class="w-100 p-2 float-right" >
							<h5 class="text-light">{{ block.title }}</h5>
							<p class="m-0 text-secondary">Description here</p>
						</div>
					</article>
				</li>
			</ul>
		</article>
	</section>
</template>

<script>
	/*** [IMPORT] Import ***/
	import TitleHeader from '../../components/cat/TitleHeader'
	import CatService from '../../services/CatService'
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		components: {
			TitleHeader,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				blocks: []
			}
		},

		created: async function() {
			this.blocks = await CatService.getAllBlocks()

			console.log('created', this.blocks)
		},

		methods: {
			redirectToBlock(block_id) {
				router.push({ name: 'Block', params: { block_id: block_id, page: 1 } })
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