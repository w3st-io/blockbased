<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<title-header :block_id="block_id" />
				<comments :commentDetails="commentDetails" />
			</div>
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'
	import Comments from '../../components/block/Comments'
	import TitleHeader from '../../components/block/TitleHeader'

	/*** [EXPORT] ***/
	export default {
		components: {
			Comments,
			TitleHeader,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page) - 1,
				allComment_ids: [],
				commentDetails: [],
				pages: [],
			}
		},

		created: async function() {	
			// [LOG]
			console.log('Page Number:', this.pageNumber)

			try {
				this.allComment_ids = await BlockService.getCommentIds(this.block_id)
				this.pages = this.returnPages(this.allComment_ids)

				console.log('commentId', this.allComment_ids)
				console.log('pages', this.pages[0][0]._id)
			}
			catch(err) { this.error = err.message }
			
			// Get Comment Details for Each ID in Pages[PageNumber] //
			for (let c in this.pages[this.pageNumber]) {
				let r = await BlockService.getCommentDetailsWithId(this.pages[this.pageNumber][c]._id)
				this.commentDetails.push(r[0])
			}

			console.log('commentDetails', this.commentDetails)
		},

		methods: {
			returnPages(allComment_ids) {
				let x = 0
				let y = 0
				let parentArray = []
				let childArray = []

				allComment_ids.forEach(comm => {
					x++
					y++

					childArray.push(comm)

					if (x == 4) {
						x = 0
						parentArray.push(childArray)
						childArray = []
					}

					if (y == (allComment_ids.length)) {
						parentArray.push(childArray)
						childArray = []
					}
				})

				return parentArray
			},
		}
	}
</script>