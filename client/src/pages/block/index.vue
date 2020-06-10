<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<title-header :block="block" />
				<Block-comment-list :commentDetails="comments" />

				<!-- [ERROR] -->
				<div v-if="error" class="alert alert-danger">
					{{ error }}
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockCommentList from '../../components/block/BlockCommentList'
	import TitleHeader from '../../components/block/TitleHeader'
	import BlockService from '../../services/BlockService'
	import CommentService from '../../services/CommentService'
	//import { EventBus } from '../../main'


	// [EXPORT] //
	export default {
		components: {
			BlockCommentList,
			TitleHeader,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page - 1),
				amountPerPage: 5,
				block: {},
				comments: [],
				error: '',
			}
		},

		created: async function() {
			// Get Block Details //
			try {
				this.block = await BlockService.getBlockDetails(this.block_id)
			}
			catch(e) { this.error = e }

			// Get Comments //
			try {
				this.comments = await CommentService.getAllComments(
					this.block_id,
					this.amountPerPage,
					this.pageNumber
				)
			}
			catch(e) { this.error = e }

			this.log()
		},

		methods: {
			log() {
				console.log('Block:', this.block)
				console.log('Comments:', this.comments)
				console.error('error:', this.error)
			}
		},
	}
</script>