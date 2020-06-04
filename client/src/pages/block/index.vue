<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<p class="text-white"></p>
				<title-header :block_id="block_id" />
				
				<h6
					class="text-light"
					v-for="(commentAll_id, index) in commentAll_ids"
					:key="index"
				>{{ commentAll_id.comment_id }}</h6>
			</div>
		</div>

		<h5 v-for="commentDetail in commentDetails" :key="commentDetail._id" class="text-danger">
			{{ commentDetail._id }} | {{ commentDetail.comment }}
			
		</h5>
		
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'
	import TitleHeader from '../../components/block/TitleHeader'

	/*** [EXPORT] ***/
	export default {
		components: {
			TitleHeader
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page) - 1,
				commentAll_ids: [],
				commentDetails: [],
				pages: [],
			}
		},

		created: async function() {		
			try {
				this.commentAll_ids = await BlockService.getCommentIds(this.block_id)
				this.pages = this.returnPages(this.commentAll_ids)
			}
			catch(err) { this.error = err.message }
			
			// Get Comment Details for Each ID in Pages[PageNumber] //
			for (let c in this.pages[this.pageNumber]) {
				let r = await BlockService.getCommentDetailsWithId(this.pages[this.pageNumber][c].comment_id)
				this.commentDetails.push(r[0])
			}

			// [LOG]
			console.log('Page Number:', this.pageNumber)
			console.log('commentId', this.commentAll_ids)
			console.log('pages', this.pages)
			console.log('commentDetails', this.commentDetails)
		},

		methods: {
			returnPages(commentAll_ids) {
				let x = 0
				let y = 0
				let parentArray = []
				let childArray = []

				commentAll_ids.forEach(comm => {
					x++
					y++

					childArray.push(comm)

					if (x == 4) {
						x = 0
						parentArray.push(childArray)
						childArray = []
					}

					if (y == (commentAll_ids.length)) {
						parentArray.push(childArray)
						childArray = []
					}
				})

				return parentArray
			},
		}
	}
</script>