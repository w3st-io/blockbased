 <template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-9 col-md-8 col-sm-8">
			<!-- Title + Page Nav Buttons -->
			<h3 class="mb-2 text-light">
				{{ block.title }}
				<span class="text-secondary hide-the-ugly" style="font-size: .5em;">
					Posted by: {{ block.user.username }} - {{ block.createdAt }}
				</span>
			</h3>

			<button
				:disabled="disabled"
				@click="redirectToBlockCommentCreate()"
				class="btn btn-sm btn-primary"
			>Add Comment</button>
		</div>

		<!-- Right Side -->
		<div class="col-lg-3 col-md-4 col-sm-4 text-right">
			<div class="mb-3">
				<span>
					<span class="ml-2 badge badge-light">
						{{ block.followersCount }}
					</span>
					<button
						:disabled="disabled"
						@click="followBtn()"
						class="ml-2 btn btn-sm btn-outline-secondary"
						:class="{ 'btn-outline-success': block.followed }"
					>{{ block.followed ? 'following ✓' : 'follow' }}</button>
				</span>
			</div>

			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'
	import BlockService from '@services/BlockService'

	// [EXPORT] //
	export default {
		components: {
			PageNavButtons
		},
		
		props: {
			block: { type: Object, required: true },
			leftBtnEmitName: { type: String, required: true, },
			rightBtnEmitName: { type: String, required: true, },
			badgeValue: { required: true, },
		},

		data: function() {
			return {
				disabled: false,
				following: false,
				pageNumber: this.$route.params.page,
				error: '',
			}
		},

		created: function() {
			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [BTN] FOLLOW *******************/
			async followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					if (!this.block.followed) {
						try { await BlockService.s_follow(this.block._id) }
						catch (e) { this.error = e }
					}
					else {
						try { await BlockService.s_unfollow(this.block._id) }
						catch (e) { this.error = e }
					}

					this.$emit('refreshBlock')

					// Enable Buttons //
					this.disabled = false
				}
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlockCommentCreate() {
				router.push({ path: `/block-comment-create/${this.block._id}` })
			},

			log() {
				console.log('%%% [COMPONENT] TitleHeader %%%')
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