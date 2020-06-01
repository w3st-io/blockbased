<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<p class="text-white"></p>
				<title-header />
				<comments />
			</div>
		</div>
		
	</section>
</template>

<script>
	import Comments from '../../components/post-single/Comments'
	import TitleHeader from '../../components/post-single/TitleHeader'
	import { comments } from '../../../defaults/cats'

	export default {
		components: {
			Comments,
			TitleHeader
		},

		data: function() {
			return {
				comments: comments,
				pages: [],
			}
		},

		created: function() {
			// Put All Comments Into Sections(pages) //
			this.pages = this.returnPages(this.comments)
			console.log('Pages Array Returned:', this.pages)
		},

		methods: {
			returnPages(comments) {
				let x = 0
				let y = 0
				let parentArray = []
				let childArray = []

				comments.forEach(comm => {
					x++
					y++

					childArray.push(comm)

					if (x == 4) {
						x = 0
						parentArray.push(childArray)
						childArray = []
					}

					if (y == (comments.length)) {
						parentArray.push(childArray)
						childArray = []
					}
				})

				return parentArray
			},
		}
	}
</script>