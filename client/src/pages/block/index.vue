<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<p class="text-white"></p>
				<title-header :block_id="block_id" />
				
				<h6
					class="text-light"
					v-for="(commentId, index) in commentIds"
					:key="index"
				>{{ commentId.comment_id }}</h6>
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
				pageNumber: this.$route.params.page,
				commentIds: [],
				commentDetails: [],
				pages: [],
			}
		},

		created: async function() {
			try {
				this.commentIds = await BlockService.getCommentIds(this.block_id)
				this.pages = this.returnPages(this.commentIds)
			}
			catch(err) { this.error = err.message }

			// Data Retrieval Successful //
			if (this.commentIds != []) {
				// For Each Comment with this page[index]
				this.pages[this.pageNumber].forEach(async (element) => {
					
					try {
						// Get Details For Each ID // Store Into Array //					
						let r = await BlockService.getCommentDetailsWithId(element.comment_id)

						this.commentDetails.push(r[0])
					}
					catch (e) { console.log('Error', e) }
				})

				console.log('commentDetails', this.commentDetails)
				console.log('commentId', this.commentIds)
			}
		},

		methods: {
			returnPages(commentIds) {
				let x = 0
				let y = 0
				let parentArray = []
				let childArray = []

				commentIds.forEach(comm => {
					x++
					y++

					childArray.push(comm)

					if (x == 4) {
						x = 0
						parentArray.push(childArray)
						childArray = []
					}

					if (y == (commentIds.length)) {
						parentArray.push(childArray)
						childArray = []
					}
				})

				return parentArray
			},
		}
	}
</script>