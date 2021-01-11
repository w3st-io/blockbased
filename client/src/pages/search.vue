<template>
	<BContainer>
		<BRow class="mt-3 text-light">
			<BCol cols="12">
				<BCard bg-variant="dark">
					<PostList
						v-if="loading"
						:posts="posts"
						@refreshPosts="getPageData()"
					/>
				</BCard>
				{{ reqData }}
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import PostList from '@components/post/List'
	import PageService from '@services/PageService'

	export default {
		components: {
			PostList
		},

		data() {
			return {
				query: this.$route.params.query,
				reqData: '',
				posts: [],
				error: '',
				loading: true,
			}
		},

		async created() {
			this.getPageData()
		},

		methods: {
			async getPageData() {
				try {
					this.reqData = await PageService.s_search(this.query)

					if (this.reqData.status) {
						this.posts = this.reqData.postResults
					}
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},
		},
	}
</script>