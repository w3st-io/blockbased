<template>
	<section class="container">
		<article class="row">
			<div class="col-12 my-4 card card-body bg-dark">
				<!-- Title Header -->
				<title-header
					:block="block"
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
				/>

				<!-- Comments -->
				<Block-comment-list :commentDetails="comments" />

				<!-- [ERROR] -->
				<div v-if="error" class="alert alert-danger">
					{{ error }}
				</div>
			</div>
		</article>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockCommentList from '@components/pages/block/BlockCommentList'
	import TitleHeader from '@components/pages/block/TitleHeader'
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
	import router from '@router'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			BlockCommentList,
			TitleHeader,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				amountPerPage: 5,
				block: {},
				comments: [],
				error: '',
			}
		},

		created: async function() {
			// [--> EMMIT] block-prev, block-next //
			EventBus.$on('block-prev', () => { this.prevPage() })
			EventBus.$on('block-next', () => { this.nextPage() })
			
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
					this.pageIndex
				)
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%% Block Index %%')
				console.log('Block:', this.block)
				console.log('Comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},

			prevPage() {
				this.pageIndex++

				// As long as the page is not going into 0 or negative
				if (this.pageIndex != 1) {
					this.pageIndex--
					router.push({ path: `/block/${this.block_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				} 
			},

			nextPage() {
				this.pageIndex++

				// As long as page does not exceed max Number of Pages
				if (this.pageIndex == this.pageIndex) {
					this.pageIndex++
					router.push({ path: `/block/${this.block_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},
		},
	}
</script>