 <template>
	<BRow>
		<!-- Left Side -->
		<div class="col-lg-9 col-md-8 col-sm-8">
			<!-- Title + Page Nav Buttons -->
			<h3 class="mb-2 text-light">
				{{ post.title }}
				<span class="text-secondary hide-the-ugly" style="font-size: .5em;">
					Posted by: {{ post.user.username }} -
					{{ new Date(post.created_at).toLocaleString() }}
				</span>
			</h3>

			<button
				:disabled="disabled"
				@click="redirectToPostCommentCreate()"
				class="btn btn-sm btn-primary"
			>Add Comment</button>
		</div>
		<!-- Right Side -->
		<div class="col-lg-3 col-md-4 col-sm-4 text-right">
			<div class="mb-3">
				<span>
					<span class="ml-2 badge badge-light">
						{{ post.followsCount }}
					</span>
					<button
						:disabled="disabled"
						@click="followBtn()"
						class="ml-2 btn btn-sm btn-outline-secondary"
						:class="{ 'btn-outline-success': post.followed }"
					>{{ post.followed ? 'following ✓' : 'follow' }}</button>
				</span>
			</div>

			<!-- Page Control -->
			<PageNavButtons
				:badgeValue="badgeValue"
				@start-btn="start()"
				@prev-btn="prev()"
				@next-btn="next()"
				@end-btn="end()"
			/>
		</div>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'
	import PostService from '@services/PostService'

	// [EXPORT] //
	export default {
		components: {
			PageNavButtons
		},
		
		props: {
			post: {
				type: Object,
				required: true,
			},

			badgeValue: {
				required: true,
			},
		},

		data: function() {
			return {
				disabled: false,
				username: '',
				created_at: '',
				error: '',
			}
		},

		created: async function() {
			if (this.post) {
				this.username = this.post.user.username
				this.created_at = this.post.created_at
			}
			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [BTN] FOLLOW *******************/
			async followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					if (!this.post.followed) {
						try { await PostService.s_follow(this.post._id) }
						catch (err) { this.error = err }
					}
					else {
						try { await PostService.s_unfollow(this.post._id) }
						catch (err) { this.error = err }
					}

					this.$emit('refreshPost')

					// Enable Buttons //
					this.disabled = false
				}
			},

			/******************* [BTN] Page Controls *******************/
			start() { this.$emit('start-btn') },

			prev() { this.$emit('prev-btn') },

			next() { this.$emit('next-btn') },

			end() { this.$emit('end-btn') },

			/******************* [ROUTER + LOG] *******************/
			redirectToPostCommentCreate() {
				router.push({
					name: 'comment-create',
					params: { post_id: this.post._id, }
				})
			},

			log() {
				console.log('%%% [COMPONENT] TitleHeader %%%')
				console.log('post:', this.post)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>

<style lang="scss" scoped>
	// Small devices (landscape phones, 576px and up) //
	@media (max-width: 767.98px) { .hide-the-ugly { display: none; } }
</style>