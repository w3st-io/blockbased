<template>
	<article class="row">
		<section class="col-12">
			<ul
				v-if="!loading && blocks != ''"
				class="m-0 px-0 border border-secondary"
			>
				<li
					v-for="(block, index) in blocks"
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
						@click="redirectToBlock(block._id)"
					>
						<h5 class="text-light">
							{{ block.title }}
						</h5>
						<p class="m-0 small text-secondary">
							<span v-if="block.user.username" class="text-light">
								{{ block.user.username }}
							</span>
							- {{ block.createdAt }}
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
						v-on:click="redirectToBlock(block._id)"
					>
						<p class="
							pb-0 m-0 badge badge-primary align-self-center text-light
						">
							<span class="m-0">
								<p class="h4 m-0">
									{{ commentCounts[block._id] }}
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
						v-on:click="redirectToBlock(block._id)"
					>
						<h4 class="m-0 text-white">
							<button
								:disabled="disabled"
								@click.prevent.stop="likeBtn(block)"
								:class="{ 'liked': checkForUserLike(block) }"
								class="w-100 btn btn-outline-secondary unliked"
							>{{ block.likers.length }} ▲</button>
						</h4>
					</div>
				</li>
			</ul>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="!loading && blocks == ''" class="mt-3" />

			<!-- [LOADING] -->
			<div v-show="loading" class="m-0 mt-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>

			<!-- [ALERTS] -->
			<div v-show="error" class="m-0 mt-3 alert alert-danger">
				Block List: {{ error }}
			</div>
		</section>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			NoContent,
		},

		props: {
			cat_id: { type: String, required: true, },
			pageIndex: { type: Number, required: true, },
			amount: { type: Number, required: true, },
			
		},

		data: function() {
			return {
				user_id: '',
				email: '',
				username: '',
				loading: true,
				disabled: false,
				blocks: [],
				commentCounts: {},
				error: '',
			}
		},

		created: async function () {
			if (localStorage.usertoken) {
				// Retrieve User Data //
				let decoded = UserService.getUserTokenDecodeData()
				this.user_id = decoded._id
				this.email = decoded.email
				this.username = decoded.username
			}

			// [INIT] Blocks //
			await this.blocksReadAll()
			
			// [INIT] Total Comments //
			await this.totalComments()

			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [INIT] Block *******************/
			async blocksReadAll() {
				try {
					this.blocks = await BlockService.readAll(
						this.cat_id,
						this.amount,
						this.pageIndex
					)
				}
				catch(e) { this.error = e }

				// Set Error //
				if (!this.blocks.status) this.error = this.blocks.error
			},

			/******************* [INIT] Profile *******************/
			// Add a Profile Data Section of the person who created the block

			/******************* [INIT] Count *******************/
			async totalComments() {
				// For the Size of the # of Cats.. //
				for (let i = 0; i < this.blocks.length; i++) {
					let block_id = this.blocks[i]._id

					this.commentCounts[block_id] = await CommentService.s_count(block_id)
					console.log(this.commentCounts)
				}
			},

			/******************* [INIT] Like *******************/
			checkForUserLike(block) {
				// Search For Likers Id in Block's Object //
				let found = block.likers.find((liker) => (
					liker == this.user_id
				))

				if (found != null) { return true }
				else { return false }
			},

			/******************* [BTN] Like *******************/
			likeBtn(block) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					if (this.checkForUserLike(block)) { this.blockUnlike(block._id) }
					else { this.blockLike(block._id) }
				}
			},

			async blockLike(block_id) {
				this.disabled = true

				// [CREATE] //
				try { await BlockService.like(block_id) }
				catch(e) { this.error = e }
				
				// [READ] Update Blocks //
				await this.blocksReadAll()
				
				this.disabled = false
			},

			async blockUnlike(block_id) {
				this.disabled = true

				// [DELETE] //
				try { await BlockService.unlike(block_id) }
				catch(e) { this.error = e }

				// [READ] Update Blocks //
				await this.blocksReadAll()

				this.disabled = false
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlock(block_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'Block',
						params: { block_id: block_id, page: 1 }
					})
				}
			},

			log() {
				console.log('%%% [COMPONENT] BlockList %%%')
				console.log('blocks:', this.blocks)
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
		&:hover { @extend .bg-primary; }
	}
	
	li:nth-child(even) {
		background: $backgroundGrey !important;
		&:hover { @extend .bg-primary; }
	}

	.unliked {
		color: white;
		font-size: 1em;

		&:hover { color: $like !important; }
	}

	.liked { color: $like !important; }
</style>