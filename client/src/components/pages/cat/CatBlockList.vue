<template>
	<section>
		<ul class="w-100 m-0 px-0 border border-secondary">
			<li
				class="m-0 bg-dark"
				v-for="(block, index) in blocks"
				:key="index"
			>
				<article class="d-inline-block w-100">
					<!-- Title --> 
					<div class="w-75 p-2 float-left" @click="redirectToBlock(block._id)" >
						<h5 class="text-light">
							{{ block.title }}
						</h5>
						<p class="m-0 small text-secondary">
							<span class="text-light">{{ block.email }}</span>
							- {{ block.createdAt }}
						</p>
					</div>

					<!-- Vote -->
					<div class="w-25 float-right text-right">
						<h4 class="text-white m-2">
							<button
								:disabled="disabled"
								@click="voteToggle(block._id)"
								class="btn btn-outline-secondary unvoted"
								style="font-size: 1em;"
								:class="{ 'voted': votesReplica[block._id].voted }"
							>
								{{ votesReplica[block._id].voteCount }} ▲
							</button>
						</h4>
					</div>
				</article>
			</li>
		</ul>
		<!-- [ERROR] -->
		<div v-if="error" class="alert alert-danger">
			CatBlockList: {{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import BlockService from '@services/BlockService'
	import BlockVotesService from '@services/BlockVotesService'

	// [EXPORT] //
	export default {
		props: {
			cat_id: {
				type: String,
				required: true,
			},

			pageIndex: {
				type: Number,
				required: true,
			},

			amountPerPage: {
				type: Number,
				required: true
			},

			user_id: {
				type: String,
				required: true
			},

			email: {
				type: String,
				required: true
			},
			
			username: {
				type: String,
				required: true
			},
		},

		data: function() {
			return {
				disabled: false,
				blocks: [],
				votesReplica: {},
				error: '',
			}
		},

		created: async function() {
			// Get Blocks //
			try {
				this.blocks = await BlockService.getAllBlocks(
					this.cat_id,
					this.amountPerPage,
					this.pageIndex
				)
			}
			catch(e) { this.error = e }

			// Create/store "votesReplica" //
			this.blocks.forEach(block => {
				let load = { voteCount: block.voteCount, voted: false }

				if (this.searchVoterInBlockArray(block.voters)) {
					load = { voteCount: block.voteCount, voted: true }
				}

				this.votesReplica[block._id] = load
			})

			// [LOG] //
			this.log()
		},

		methods: {
			searchVoterInBlockArray(block_voters) {
				// Search For Voters Id in Block's Object //
				let found = block_voters.find((voter) => (
					voter.username == this.username
				))

				if (found) { return true }
				else { return false }
			},

			voteToggle(block_id) {
				// Check if User is logged in
				if (localStorage.usertoken){
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

			voteIconAndCountHandler(block_id) {
				this.votesReplica[block_id].voted = !this.votesReplica[block_id].voted

				if (this.votesReplica[block_id].voted) {
					this.votesReplica[block_id].voteCount++
				}
				else {
					this.votesReplica[block_id].voteCount--
				} 
			},

			async addVote(block_id) {
				// [CREATE] Like in "blockVotes" Colelction //
				// [UPDATE] Block Object //
				try {
					await BlockVotesService.addBlockVote(
						block_id,
						this.user_id,
						this.email,
						this.username,
					)
				}
				catch(e) { this.error = e }

				// [UPDATE] Block Object //
				try {
					await BlockService.addVote(
						block_id,
						this.user_id,
						this.email,
						this.username,
					)
				}
				catch(e) { this.error = e }
			},

			async removeVote(block_id) {
				// [DELETE] Like in "blockVotes" Collection //
				try {
					await BlockVotesService.removeBlockVote(
						block_id,
						this.user_id,
					)
				}
				catch(e) { this.error = e }

				// [UPDATE] Block Object //
				try {
					await BlockService.removeVote(
						block_id,
						this.user_id,
					)
				}
				catch(e) { this.error = e }
			},

			async getBlocks() {
				// [UPDATE] //
				try {
					this.blocks = await BlockService.getAllBlocks(
						this.cat_id,
						this.amountPerPage,
						this.pageIndex
					)
				}
				catch(e) { this.error = e }
			},

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
	$white: #ffffff;
	$dark: #343a40;
	$grey: #42484e;
	$ethereum: #434875;
	$green: #00e200;

	li { list-style: none; }

	li { background: $dark !important; }
	li:nth-child(even) { background: $grey !important; }

	li:hover { background: $ethereum !important; }

	.unvoted {
		-webkit-text-stroke-color: $white;
	}
	.unvoted:hover {
		color: $green;
		-webkit-text-stroke-color: $green;
	}

	.voted {
		color: $green;
		-webkit-text-stroke-color: $green;
	}
</style>