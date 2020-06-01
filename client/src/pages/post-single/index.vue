<template>
	<section class="my-3 container">
		<div class="row">
			<div class="col-12">
				<title-header />
				<comments />
			</div>
		</div>
		
	</section>
</template>

<script>
	import Comments from '../../components/post-single/Comments'
	import TitleHeader from '../../components/post-single/TitleHeader'
	import { pages } from '../../../defaults/cats'

	export default {
		components: {
			Comments,
			TitleHeader
		},

		data: function() {
			return {
				pages: pages,
				currentPagePost: []
			}
		},

		created: function() {
			this.currentPagePost = pages[0]

			console.log('currentPagePost:', this.currentPagePost)
		},
	}
</script>