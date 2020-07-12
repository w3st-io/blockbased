<template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-6 col-md-8 col-sm-8">
			<!-- Title + Page Nav Buttons -->
			<h3 class="m-0 text-light">{{ block.title }}</h3>
			<p class="text-secondary">created by: {{ block.username }}</p>

			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-lg-6 col-md-4 col-sm-4 text-right">
			<p class="mb-3 text-secondary small hide-the-ugly">
				{{ block.createdAt }}
			</p>
			
			<div class="mb-3">
				<span>
					<span class="ml-2 badge badge-light">
							{{ followsReplica.followersCount }}
						</span>
					<button
						:disabled="disabled" 
						@click="followBtn()"
						class="ml-2 btn btn-sm"
						:class="{
							'btn-outline-secondary': !followsReplica.voted,
							'btn-outline-success': followsReplica.voted
						}"
					>{{ followBtnText }}</button>
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
				disabled: true,
				pageNumber: (this.$route.params.page),
				block: {},
				followsReplica: {},
				followBtnText: 'Unset',
				error: '',
			}
		},

		created: async function() {
			// Get Block Details //
			await this.blockRead()

			// Set Follows Replica //
			this.setFollowsReplica()
			
			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [INIT] Block *******************/
			async blockRead() {
				try {
					this.block = await BlockService.read(this.block_id)
					
					// Enable Button //
					this.disabled = false
				}
				catch(e) { this.error = e }
			},

			/******************* [INIT] Follow *******************/
			setFollowsReplica() {
				let insert = {
					followersCount: this.block.followers.length,
					following: false
				}

				if (this.searchForUserInFollowers(this.block.followers)) {
					insert = {
						followersCount: this.block.followers.length,
						following: true
					}
				}

				this.followsReplica = insert

				// Set Follow Text //
				this.setFollowBtnText()
			},

			searchForUserInFollowers(followers) {
				// Search For Voters Id in Block's Object //
				let found = followers.find((follower) => (
					follower.user_id == this.user_id
				))

				if (found) { return true }
				else { return false }
			},

			setFollowBtnText() {
				if (this.followsReplica.voted) { this.followBtnText = 'following ✓' }
				else { this.followBtnText = 'follow' }
			},

			/******************* [BTN] FOLLOW *******************/
			followBtn() {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					// Set Replica Icon and Count // Rerender Blocks //
					this.followIconAndCountHandler()
					this.blockRead()

					// Conditional DB Actions //
					if (this.followsReplica.voted) { this.addFollow() }
					else { this.removeFollow() }

					// Enable Buttons //
					this.disabled = false
				}
			},

			async addFollow() {
				try { console.log('add') }
				catch(e) { this.error = e }
			},

			async removeFollow() {
				try { console.log('remove') }
				catch(e) { this.error = e }
			},

			followIconAndCountHandler() {
				this.followsReplica.voted = !this.followsReplica.voted

				if (this.followsReplica.voted) { this.followsReplica.followersCount++ }
				else { this.followsReplica.followersCount-- }

				// Set Follow Text //
				this.setFollowBtnText()
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			},

			log() {
				console.log('%%% [COMPONENT] TitleHeader %%%')
				console.log('block_id:', this.block_id)
				console.log('block:', this.block)
				console.log('followsReplica:', this.followsReplica)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>

<style lang="scss" scoped>
	// Small devices (landscape phones, 576px and up)
	@media (max-width: 767.98px) { 
		.hide-the-ugly { display: none; }
	}
</style>