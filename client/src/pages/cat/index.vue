<template>
	<section class="my-3 container">
		<article class="row">
			<div class="col-12">
				<!-- Title With Create Button -->
				<title-header :cat_id="cat_id" />

				<!-- Display All the Blocks -->
				<cat-block-list :blocks="blocks" />
			</div>
		</article>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import CatBlockList from '../../components/cat/CatBlockList'
	import TitleHeader from '../../components/cat/TitleHeader'
	import BlockService from '../../services/BlockService'
	import router from '../../router'
	import { EventBus } from '../../main'

	/*** [EXPORT] ***/
	export default {
		components: {
			CatBlockList,
			TitleHeader,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				blocks: [],
			}
		},

		created: async function() {
			// [--> EMMIT] Redirect
			EventBus.$on('redirect-to-block', (block_id) => { this.redirectToBlock(block_id) })

			this.blocks = await BlockService.getAllBlocks(this.cat_id)

			this.log()
		},

		methods: {
			log() {
				console.log('blocks:', this.blocks)
			},

			redirectToBlock(block_id) {
				router.push({ name: 'Block', params: { block_id: block_id, page: 1 } })
			}
		}
	}
</script>