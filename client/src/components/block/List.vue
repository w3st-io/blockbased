<template>
	<section class="row">
		<div v-if="!loading" class="col-12">
			<ul class="m-0 px-0 border border-secondary">
				<li
					v-for="(block, index) in blocks"
					:key="index"
					class="row m-0 bg-dark"
				>
					<!-- Title --> 
					<div
						class="
							col-lg-10
							col-md-8
							col-sm-8
							col-9
							p-2
						"
						@click="redirectToBlock(block._id)"
					>
						<h5 class="text-light">
							{{ block.title }}
						</h5>
						<p class="m-0 small text-secondary">
							<span class="text-light">{{ block.username }}</span>
							- {{ block.createdAt.toLocaleString() }}
						</p>
					</div>

					<!-- Total Comments -->
					<div
						class="
							col-lg-1
							col-md-2
							col-sm-2
							col-xs-3
							col-3
							p-2
							text-center
						" 
						v-on:click="redirectToBlock(block._id)"
					>
						<p class="badge badge-primary align-self-center text-light">
							<span class="m-0">
								<p class="h4 m-0">
									{{ commentCounts[block._id] }}
								</p>
								<span>Comments</span>
							</span>
						</p>
					</div>

					<!-- Vote -->
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
								@click.prevent.stop="voteBtn(block._id)"
								:class="{ 'voted': votesReplica[block._id].voted }"
								class="w-100 btn btn-outline-secondary unvoted"
							>{{ votesReplica[block._id].voteCount }} ▲</button>
						</h4>
					</div>
				</li>
			</ul>
		</div>
		
		<!-- [LOADING + ERROR] -->
		<div v-show="loading" class="col-12 my-3">
			<div class="m-0 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		</div>
		<div v-show="error" class="col-12">
			<div class="m-0 alert alert-danger">
				CatBlockList: {{ error }}
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import BlockService from '@services/BlockService'
	import BlockVotesService from '@services/BlockVotesService'
	import CommentService from '@services/CommentService'

	// [EXPORT] //
	export default {
		props: {
			cat_id: { type: String, required: true, },
			pageIndex: { type: Number, required: true, },
			amountPerPage: { type: Number, required: true, },
			user_id: { type: String, required: true, },
			email: { type: String, required: true, },
			username: { type: String, required: true, },
		},

		data: function() {
			return {
				loading: true,
				disabled: false,
				blocks: [],
				votesReplica: {},
				commentCounts: {},
				error: '',
			}
		},

		created: async function () {
			// Initialize Blocks //
			await this.getBlocks()

			// Initialize VotesReplica //
			this.setVotesReplica()
			

			// Set Total Comments //
			await this.totalComments()

			// Disable Loading //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [INIT] Block *******************/
			async getBlocks() {
				try {
					this.blocks = await BlockService.getAllBlocks(
						this.cat_id,
						this.amountPerPage,
						this.pageIndex
					)
				}
				catch(e) { this.error = e }
			},

			/******************* [INIT] Profile *******************/
			// Add a Profile Data Section of the person who created the block

			/******************* [INIT] Count *******************/
			async totalComments() {
				// For the Size of the # of Cats.. //
				for (let i = 0; i < this.blocks.length; i++) {
					let block_id = this.blocks[i]._id

					this.commentCounts[block_id] = await CommentService.countCommentsForBlock(block_id)
				}
			},

			/******************* [INIT] Vote *******************/
			setVotesReplica() {
				this.blocks.forEach(block => {
					let insert = { voteCount: block.voters.length, voted: false }

					if (this.searchVotersArrayInBlock(block.voters)) {
						insert = { voteCount: block.voters.length, voted: true }
					}

					this.votesReplica[block._id] = insert
				})
			},

			searchVotersArrayInBlock(blockVoters) {
				// Search For Voters Id in Block's Object //
				let found = blockVoters.find((voter) => (
					voter.user_id == this.user_id
				))

				if (found) { return true }
				else { return false }
			},

			/******************* [BTN] Vote *******************/
			voteBtn(block_id) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					// Set Replica Icon and Count // Rerender Blocks //
					this.voteIconAndCountHandler(block_id)
					this.getBlocks()

					// Conditional DB Actions //
					if (this.votesReplica[block_id].voted) {
						this.addVote(block_id)
					}
					else { this.removeVote(block_id) }

					// Enable Buttons //
					this.disabled = false
				}
			},

			async addVote(block_id) {
				// [CREATE] Vote in "blockVotes" Colelction //
				try { await BlockVotesService.createBlockVote(block_id) }
				catch(e) { this.error = e }

				
				try { BlockService.addVote(block_id) }
				catch(e) { this.error = e }
			},

			async removeVote(block_id) {
				// [DELETE] Vote in "blockVotes" Collection //
				try { await BlockVotesService.deleteBlockVote(block_id) }
				catch(e) { this.error = e }

				// [UPDATE] Block Object //
				try { await BlockService.removeVote(block_id) }
				catch(e) { this.error = e }
			},

			voteIconAndCountHandler(block_id) {
				this.votesReplica[block_id].voted = !this.votesReplica[block_id].voted

				if (this.votesReplica[block_id].voted) {
					this.votesReplica[block_id].voteCount++
				}
				else { this.votesReplica[block_id].voteCount-- } 
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToBlock(block_id) {
				// [REDIRECT] //
				router.push({ name: 'Block', params: { block_id: block_id, page: 1 } })
			},

			log() {
				console.log('%%% [COMPONENT] CatBlockList %%%')
				console.log('cat_id:', this.cat_id)
				console.log('pageIndex:', this.pageIndex)
				console.log('amountPerPage:', this.amountPerPage)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				console.log('blocks:', this.blocks)
				console.log('votesReplica:', this.votesReplica)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang='scss' scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/bootstrap-override.scss';
	@import 'src/assets/styles/sass-variables.scss';

	li {
		list-style: none;
		&:hover { @extend .bg-primary; }
	}
	
	li:nth-child(even) {
		background: $grey;
		&:hover { @extend .bg-primary; }
	}

	.unvoted {
		color: white;
		font-size: 1em;

		&:hover { color: $like; }
	}

	.voted { color: $like; }
</style>