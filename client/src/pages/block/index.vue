<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<title-header :block="block" />
				<Block-comment-list :commentDetails="comments" />
			</div>
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockCommentList from '../../components/block/BlockCommentList'
	import TitleHeader from '../../components/block/TitleHeader'
	import BlockService from '../../services/BlockService'
	import CatService from '../../services/CatService'


	/*** [EXPORT] ***/
	export default {
		components: {
			BlockCommentList,
			TitleHeader,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page) - 1,
				block: {},
				comments: [],
				error: '',
			}
		},

		created: async function() {
			// Get Block Details //
			try {
				this.block = await CatService.getBlockDetails(this.block_id)
				console.log('Block', this.block)
			}
			catch(e) { this.error = e }

			// Get Comments //
			try {
				this.comments = await BlockService.getComments(this.block_id, this.pageNumber)
			}
			catch(e) { this.error = e }
		},
	}
</script>