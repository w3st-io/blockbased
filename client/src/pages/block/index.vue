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
				>{{ commentId._id }}</h6>
			</div>
		</div>
		
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlocksXCommentsService from '../../services/BlocksXCommentsService'
	import TitleHeader from '../../components/block/TitleHeader'

	/*** [EXPORT] ***/
	export default {
		components: {
			TitleHeader
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				page: this.$route.params.page,
				PostXComment: '',
				commentIds: [],
				pages: [],
			}
		},

		created: async function() {
			try {
				this.commentIds = await BlocksXCommentsService.getCommentIds(this.block_id)
				// Put All Comments Into Sections(pages) //
				this.pages = this.returnPages(this.commentIds)
				console.log(this.pages)
			}
			catch(err) { this.error = err.message }
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