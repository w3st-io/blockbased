<template>
	<article class="row">
		<section class="col-12">
			<ul
				v-if="!loading && posts != ''"
				class="m-0 px-0 border border-secondary"
			>
				<li
					v-for="(post, index) in posts"
					:key="index"
					class="row m-0 bg-dark"
				>
					<!-- Title --> 
					<div
						class="
							col-lg-9
							col-md-8
							col-sm-8
							col-xs-8
							col-8
							p-2
						"
						@click="redirectToPost(post._id)"
					>
						<h5 class="text-light">{{ post.title }}</h5>
						<p class="m-0 small text-secondary">
							<span v-if="post.user.username" class="text-light">
								{{ post.user.username }}
							</span>
							- {{ post.createdAt }}
						</p>
					</div>

					<!-- Total Comments -->
					<div
						class="
							col-lg-2
							col-md-2
							col-sm-2
							col-xs-3
							col-4
							p-2
							text-center
						" 
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
					</div>

					<!-- Like -->
					<div
						class="
							col-lg-1
							col-md-2
							col-sm-2
							p-2
							text-center
						"
						@click="redirectToPost(post._id)"
					>
						<h4 class="m-0 text-white">
							<button
								:disabled="disabled"
								@click.prevent.stop="likeBtn(post)"
								class="w-100 btn"
								:class="{
									'btn-outline-success': post.liked,
									'btn-outline-secondary': !post.liked,
								}"
							>{{ post.likeCount }} ▲</button>
						</h4>
					</div>
				</li>
			</ul>

			<!-- [ALERTS] -->
			<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
		</section>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import PostService from '@services/PostService'

	// [EXPORT] //
	export default {
		props: {
			posts: { type: Array, required: true, },
		},

		data: function() {
			return {
				loading: true,
				disabled: false,
				returned: '',
				error: '',
			}
		},

		created: async function() {
			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] Like *******************/
			async likeBtn(post) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					this.disabled = true
					
					if (post.liked) {
						try { this.returned = await PostService.s_unlike(post._id) }
						catch (err) { this.error = err }
					}
					else {
						try { this.returned = await PostService.s_like(post._id) }
						catch (err) { this.error = err }
					}

					if (this.returned.status == true)  {
						// [UPDATE] Posts //
						this.$emit('refreshPosts')

						// Wait 2 seconds before enabling
						setTimeout(() => { this.disabled = false }, 2000)							
					}
				}
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToPost(post_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'post',
						params: { post_id: post_id, page: 1 }
					})
				}
			},

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
		list-style: none;
		&:hover { @extend .bg-secondary; }
	}
	
	li:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { @extend .bg-secondary; }
	}

	.btn { font-size: 1em; }
</style>