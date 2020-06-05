<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<title-header :block_id="block_id" />
				<Block-comment-list :commentDetails="comments" />
			</div>
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'
	import BlockCommentList from '../../components/block/BlockCommentList'
	import TitleHeader from '../../components/block/TitleHeader'

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
				comments: [],
				
			}
		},

		created: async function() {	
			// [LOG]
			console.log('Page Number:', this.pageNumber)

			try {
				this.comments = await BlockService.getComments(this.block_id, this.pageNumber)
			}
			catch(err) { this.error = err.message }
		},
	}
</script>