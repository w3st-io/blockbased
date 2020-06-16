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
							- {{ block.createdAt }}<br>
							{{ block._id }}
						</p>
					</div>

					<!-- Vote -->
					<div class="w-25 float-right text-right">
						<h4 class="text-white m-2">
							{{ block.voteCount }}
							<span
								class="ml-2 h2 unvoted"
								:class="{ 'voted': voterInBlockArray(block.voters) }"
								@click="vote(block._id)"
							>♦</span>
							<br>
							<button
								class="my-1 btn btn-sm btn-light"
								@click="unvote(block._id)"
							>
								Unlike
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
	// [IMPORT] //
	//import axios from 'axios'

	// [IMPORT] Personal //
	import router from '@router'
	import BlockService from '@services/BlockService'

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
				blocks: [],
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

			// [LOG] //
			this.log()
		},

		methods: {
			redirectToBlock(block_id) {
				router.push({ name: 'Block', params: { block_id: block_id, page: 1 } })
			},

			voterInBlockArray(block_voters) {
				let found = block_voters.find((voter) => (
					voter.username == this.username
				))

				if (found) { return true }
				else { return false }
			},

			async vote(block_id) {
				// Update Block's Voters //
				try {
					await BlockService.addVote(
						block_id,
						this.user_id,
						this.email,
						this.username,
					)
				}
				catch(e) { this.error = e }

				this.refreshBlocks()			
			},

			async unvote(block_id) {
				// Update Block's Voters //
				try {
					await BlockService.removeVote(
						block_id,
						this.user_id,
					)
				}
				catch(e) { this.error = e }

				this.refreshBlocks()
			},

			async refreshBlocks() {
				try {
					this.blocks = await BlockService.getAllBlocks(
						this.cat_id,
						this.amountPerPage,
						this.pageIndex
					)
				}
				catch(e) { this.error = e }	
			},

			log() {
				console.log('%% [COMPONENT] CatBlockList %%')
				console.log('cat_id:', this.cat_id)
				console.log('pageIndex:', this.pageIndex)
				console.log('amountPerPage:', this.amountPerPage)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				console.log('blocks:', this.blocks)
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
	$clear: #00000000;

	li { list-style: none; }

	li { background: $dark !important; }
	li:nth-child(even) { background: $grey !important; }

	li:hover { background: $ethereum !important; }

	.unvoted {
		color: $clear;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: $white;
	}
	.unvoted:hover {
		cursor: pointer;
		color: $green;
		-webkit-text-stroke-color: $green;
	}

	.voted {
		cursor: pointer;
		color: $green;
		-webkit-text-stroke-color: $green;
	}
	.voted:hover {
		cursor: pointer;
		color: $clear;
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: $white;
	}
</style>