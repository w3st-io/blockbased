 <template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-9 col-md-8 col-sm-8">
			<!-- Title + Page Nav Buttons -->
			<h3 class="text-light">{{ blockTitle }}</h3>
			<p class="text-secondary small hide-the-ugly">
				Posted by: {{ blockCreatorUsername }} - {{ block.createdAt }}
			</p>

			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-lg-3 col-md-4 col-sm-4 text-right">
			<div class="mb-3">
				<span>
					<span class="ml-2 badge badge-light">{{ blockFollowersCount }}</span>
					<button
						:disabled="disabled" 
						@click="followBtn()"
						class="ml-2 btn btn-sm btn-outline-secondary"
						:class="{ 'btn-outline-success': following }"
					>{{ following ? 'following ✓' : 'follow' }}</button>
				</span>
			</div>
			
			<button
				:disabled="disabled"
				@click="redirectToBlockCommentCreate(block._id)"
				class="btn btn-primary"
			>Add Comment</button>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			PageNavButtons
		},
		
		props: {
			block_id: { type: String, required: true, },
			leftBtnEmitName: { type: String, required: true, },
			rightBtnEmitName: { type: String, required: true, },
			badgeValue: { required: true, },
		},

		data: function() {
			return {
				decoded: {},
				disabled: false,
				following: false,
				pageNumber: this.$route.params.page,
				block: {},

				// Render Variables
				blockTitle: '',
				blockCreatorUsername: '',
				blockFollowersCount: 0,
				
				error: '',
			}
		},

		created: async function() {
			// Decode User Profile //
			await this.decode()

			// Get Block Details //
			await this.blockRead()

			this.blockTitle = this.block.title
			this.blockCreatorUsername = this.block.user.username
			this.blockFollowersCount = this.block.followers.length
			
			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [INIT] User Decode *******************/
			async decode() {
				this.decoded = await UserService.getUserTokenDecodeData()
			},

			/******************* [INIT] Block *******************/
			async blockRead() {
				try { this.block = await BlockService.s_read(this.block_id) }
				catch(e) { this.error = e }

				this.searchForUserInFollowers()
			},

			searchForUserInFollowers() {
				// Search For Likers Id in Block's Object //
				let found = this.block.followers.find((follower) => (
					follower == this.decoded._id
				))

				if (found) { this.following = true }
				else { this.following = false }
			},

			/******************* [BTN] FOLLOW *******************/
			async followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					if (!this.following) {
						try { await BlockService.s_follow(this.block_id) }
						catch(e) { this.error = e }
					}
					else {
						try { await BlockService.s_unfollow(this.block_id) }
						catch(e) { this.error = e }
					}

					// Get Block Details //
					await this.blockRead()

					// Enable Buttons //
					this.disabled = false
				}
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			},

			log() {
				console.log('%%% [COMPONENT] TitleHeader %%%')
				console.log('decoded:', this.decoded)
				console.log('block_id:', this.block_id)
				console.log('block:', this.block)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>

<style lang="scss" scoped>
	// Small devices (landscape phones, 576px and up) //
	@media (max-width: 767.98px) { .hide-the-ugly { display: none; } }
</style>