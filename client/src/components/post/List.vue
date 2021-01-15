<template>
	<BRow>
		<BCol cols="12">
			<ul
				v-if="posts != ''"
				class="m-0 px-0 border border-secondary"
			>
				<li v-for="post in posts" :key="post._id" class="list-unstyled bg-dark">
					<BRow class="test m-0">
						<!-- Title --> 
						<BCol
							cols="8" lg="9" md="8" sm="8" xs="8"
							class="p-2"
							@click="redirectToPost(post._id)"
						>
							<h5 class="text-light">
								<img
									v-if="post.pinned"
									:src="require('../../assets/images/symbol-icons/pin.svg')"
									class="small text-secondary"
									style="width: 18px;"
								>
								{{ post.title }}
							</h5>
							<p class="m-0 small text-secondary">
								<span v-if="post.user.username" class="text-light">
									{{ post.user.username }}
								</span>
								- {{ new Date(post.created_at).toLocaleString() }}
							</p>
						</BCol>

						<!-- Total Comments -->
						<BCol
							cols="4" lg="2" md="2" sm="2" xs="3"
							class="p-2 text-center" 
							@click="redirectToPost(post._id)"
						>
							<p class="pb-0 m-0 align-self-center text-light">
								<span class="m-0">
									<p class="h4 m-0">
										{{ post.commentCount }}
									</p>
									<span>Comments</span>
								</span>
							</p>
						</BCol>

						<!-- Like -->
						<BCol lg="1" md="2" sm="2"
							class="p-2 text-center" 
							@click="redirectToPost(post._id)"
						>
							<h4 class="m-0 text-white">
								<button
									:disabled="disabled"
									@click.prevent.stop="likeBtn(post)"
									class="w-100 btn"
									:class="{
										'btn-outline-success': post.liked,
										'btn-outline-light': !post.liked,
									}"
								>{{ post.likeCount }} ▲</button>
							</h4>
						</BCol>
					</BRow>

					<BRow v-if="adminLoggedIn" class="border border-warning m-0">
						<BCol cols="8" class="p-2">
							<!-- Edit -->
							<BButton
								variant="outline-warning"
								size="sm"
								@click="redirectToAdminEdit(post._id)"
								class="py-0"
							>Admin-Edit</BButton>
						
							<span class="ml-1 small text-secondary">
								{{ post._id }}
							</span>
						</BCol>
					</BRow>
				</li>
			</ul>

			<!-- Error -->
			<Alert v-if="error" variant="danger" :message="error" class="mt-3" />

			<!-- [DEFAULT] If No content -->
			<NoContent v-if="posts == ''" text="No posts" class="my-3" />
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@components/misc/Alert'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import PostService from '@services/PostService'

	// [EXPORT] //
	export default {
		props: {
			posts: { type: Array, required: true, },
		},

		components: {
			Alert,
			NoContent
		},

		data: function() {
			return {
				adminLoggedIn: false,
				disabled: false,
				returned: '',
				error: '',
			}
		},

		created: async function() {
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] Like *******************/
			async likeBtn(post) {
				// [LOG-REQUIRED] //
				if (localStorage.usertoken) {
					this.disabled = true
					
					try {
						if (post.liked) {
							this.returned = await PostService.s_unlike(post._id)
						}
						else {
							this.returned = await PostService.s_like(
								post._id,
								post.user._id
							)
						}

						if (this.returned.status == true)  {
							// [UPDATE] Posts //
							this.$emit('refreshPosts')

							// Wait 1 seconds before enabling
							setTimeout(() => { this.disabled = false }, 1000)
						}
					}
					catch (err) { this.error = err }
				}
			},

			redirectToPost(post_id) {
				// [REDIRECT] //
				router.push({
					name: 'post',
					params: {
						post_id: post_id,
						limit: 20,
						page: 1,
					}
				})
			},

			redirectToAdminEdit() {},

			log() {
				console.log('%%% [COMPONENT] PostList %%%')
				console.log('posts:', this.posts)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang='scss' scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/bootstrap-override.scss';

	li {
		&:hover { @extend .bg-secondary; }
	}
	
	li:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { @extend .bg-secondary; }
	}

	.btn { font-size: 1em; }
</style>