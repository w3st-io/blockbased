<template>
	<section class="container">
		<article class="row">
			<div class="col-12 my-4 card card-body bg-dark">
				<!-- Title Header -->
				<title-header
					:block_id="block_id"
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
				/>

				<!-- Comments -->
				<Block-comment-list
					:block_id="block_id"
					:pageIndex="pageIndex"
					:amountPerPage="5"
				/>

				<!-- Bottom Page Control -->
				<div class="mt-2 w-25">
					<page-nav-buttons
						:leftBtnEmitName="'block-prev'"
						:rightBtnEmitName="'block-next'"
						:badgeValue="pageNumber"
					/>
				</div>
				

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
	import PageNavButtons from '@components/controls/PageNavButtons'
	import BlockCommentList from '@components/pages/block/BlockCommentList'
	import TitleHeader from '@components/pages/block/TitleHeader'
	import router from '@router'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			BlockCommentList,
			TitleHeader,
			PageNavButtons,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				error: '',
			}
		},

		created: async function() {
			// [--> EMMIT] block-prev, block-next //
			EventBus.$on('block-prev', () => { this.prevPage() })
			EventBus.$on('block-next', () => { this.nextPage() })

			// [LOG] //
			this.log()
		},

		methods: {
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

			log() {
				console.log('%%% [PAGE] Block %%%')
				console.log('block_id:', this.block_id)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>