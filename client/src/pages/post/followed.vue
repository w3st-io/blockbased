<template>
	<div class="container mt-3">
		<article class="card card-body bg-dark text-light">
			<!-- Title -->
			<h3 class="mb-4">Posts You Are Following</h3>

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
	import NoContent from '@components/placeholders/NoContent'
	import PostList from '@components/post/List'
	import pageService from '@services/PageService'

	export default {
		components: {
			PostList,
			NoContent
		},

		data() {
			return {
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
				try { this.data = await pageService.s_user_favorited() }
				catch (err) { this.error = err }
				
				if (this.data.status) { this.posts = this.data.posts }
				else { this.error = this.data.message }
				
				this.loading = false
			}
		}
	}
</script>