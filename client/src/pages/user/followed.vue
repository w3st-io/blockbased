<template>
	<div class="container mt-3">
		<article class="card card-body bg-dark text-light">
			<!-- Title -->
			<h3 class="mb-4">Posts You Are Following</h3>

			<!-- Page Nav Buttons -->
			<PageNavButtons
				@prev-btn="prevPage()"
				@next-btn="nextPage()"
				:badgeValue="pageNumber"
				class="mb-3"
				style="max-width: 300px;"
			/>

			<!-- Display All the Posts -->
			<PostList
				v-if="!loading"
				:posts="posts"
				@refreshPosts="getData()"
			/>

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="!loading && posts == ''" class="mt-3" />

			<!-- [LOADING] -->
			<div v-show="loading" class="m-0 mt-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>
		</article>
	</div>
</template>

<script>
	// [IMPORT] //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import NoContent from '@components/placeholders/NoContent'
	import PostList from '@components/post/List'
	import pageService from '@services/PageService'
	import router from '@router'

	export default {
		components: {
			PageNavButtons,
			PostList,
			NoContent
		},

		data() {
			return {
				pageNumber: parseInt(this.$route.params.page),
				limit: 3,
				loading: true,
				data: {},
				posts: [],
				error: '',
			}
		},

		async created() {
			this.getData()

			console.log(this.posts)
		},

		methods: {
			async getData() {
				try {
					this.data = await pageService.s_user_favorited(
						this.limit,
						this.pageNumber - 1
					)
				}
				catch (err) { this.error = err }
				
				if (this.data.status) { this.posts = this.data.posts }
				else { this.error = this.data.message }
				
				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.loading = true
					this.pageNumber--

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'user-followed',
						params: { page: this.pageNumber }
					})
				}
			},

			nextPage() {
				console.log('sdfsdf')
				// As long as page does not exceed max Number of Pages //
				//if (this.pageNumber < this.data.pageCount) {
					this.loading = true
					this.pageNumber++

					this.getData()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'user-followed',
						params: { page: this.pageNumber }
					})
				//}
			},
		}
	}
</script>