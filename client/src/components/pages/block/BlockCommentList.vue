<template>
	<section>
		<ul class="w-100 m-0 px-0 border border-secondary">
			<li
				v-for="comment in comments"
				:key="comment._id"
				class="w-100 border-bottom-0 border-secondary"
			>
				<article class="w-100 d-flex">
					<!-- Image Section -->
					<div class="float-left p-2 border-right border-secondary" style="width: 15%;">
						<div class="w-100 text-center">
							<img src="../../../assets/images/placeholder.png" class="m-auto w-75 rounded-lg">
						</div>
						
						<p class="m-0 text-center text-light small">
							{{ comment.email }}
						</p>
					</div>

					<!-- Comment Section -->
					<div class="float-right p-2" style="flex-grow: 1; width: 85%;">
						<p v-html="comment.comment" class="m-0 text-light multiline"></p>
					</div>
				</article>

				<!-- Time Stamp -->
				<div class="w-100 p-2 d-flex border-top border-bottom border-secondary text-light">
					<div class="w-50 m-0 float-left small text-secondary">
						{{ new Date(comment.createdAt) }}
						
					</div>
					<div class="w-50 m-0 float-right small text-right text-secondary">
						<button class="py-0 btn btn-sm text-secondary">edit</button>
						<button class="py-0 btn btn-sm text-danger">delete</button>
						<button class="py-0 btn btn-sm text-danger">report</button>
						<button
							:disabled="disabled"
							@click="voteToggle(comment._id)"
							class=" btn btn-outline-secondary unvoted"
							:class="{ 'voted': votesReplica[comment._id].voted }"
						>
							{{ votesReplica[comment._id].voteCount }} ▲
						</button>
					</div>
				</div>
			</li>
		</ul>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CommentService from '@services/CommentService'
	import CommentVotesService from '@services/CommentVotesService'
	
	// [EXPORT] //
	export default {
		props: {
			block_id: {
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
				upvotes: 1,
				disabled: false,
				comments: [],
				votesReplica: {},
				error: '',
			}
		},

		created: async function() {
			// Get Comments //
			try {
				this.comments = await CommentService.getAllComments(
					this.block_id,
					this.amountPerPage,
					this.pageIndex
				)
			}
			catch(e) { this.error = e }

			// Create/store "votesReplica" //
			this.comments.forEach(comment => {
				let load = { voteCount: comment.voteCount, voted: false }

				if (this.searchVotersArrayInComment(comment.voters)) {
					load = { voteCount: comment.voteCount, voted: true }
				}

				this.votesReplica[comment._id] = load
			})

			// [LOG] //
			this.log()
		},

		methods: {
			searchVotersArrayInComment(commentVoters) {
				// Search For Voters Id in Block's Object //
				let found = commentVoters.find((voter) => (
					voter.username == this.username
				))

				if (found) { return true }
				else { return false }
			},

			voteToggle(comment_id) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					// Disable Buttons //
					this.disabled = true

					// Set Replica Icon and Count // Rerender Blocks //
					this.voteIconAndCountHandler(comment_id)
					this.getComments()

					// Conditional DB Actions //
					if (this.votesReplica[comment_id].voted) {
						this.addVote(comment_id)
					}
					else { this.removeVote(comment_id) }

					// Enable Buttons //
					this.disabled = false
				}
			},

			async addVote(comment_id) {
				// [CREATE] Like in "CommentVotes" Colelction //
				try {
					await CommentVotesService.addCommentVote(
						comment_id,
						this.block_id,
						this.user_id,
						this.email,
						this.username,
					)
				}
				catch(e) { this.error = e }

				// [UPDATE] Block Object //
				try {
					await CommentService.addVote(
						comment_id,
						this.user_id,
						this.email,
						this.username,
					)
				}
				catch(e) { this.error = e }
			},

			async removeVote(comment_id) {
				// [DELETE] Like in "CommentVotes" Collection //
				try {
					await CommentVotesService.removeCommentVote(
						comment_id,
						this.user_id,
					)
				}
				catch(e) { this.error = e }
						

				// [UPDATE] Block Object //
				try {
					await CommentService.removeVote(
						comment_id,
						this.user_id,
					)
				}
				catch(e) { this.error = e }
			},

			voteIconAndCountHandler(comment_id) {
				this.votesReplica[comment_id].voted = !this.votesReplica[comment_id].voted

				if (this.votesReplica[comment_id].voted) {
					this.votesReplica[comment_id].voteCount++
				}
				else {
					this.votesReplica[comment_id].voteCount--
				} 
			},

			async getComments() {
				// [UPDATE] Comments //
				try {
					this.comments = await CommentService.getAllComments(
						this.block_id,
						this.amountPerPage,
						this.pageIndex
					)
				}
				catch(e) { this.error = e }
			},

			log() {
				console.log('%%% [COMPONENT] BlockCommentList %%%')
				console.log('pageIndex:', this.pageIndex)
				console.log('amountPerPage:', this.amountPerPage)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				console.log('Comments:', this.comments)
				console.log('votesReplica:', this.votesReplica)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang="scss" scoped>
	// Import Bootstrap and Bootstrap Override //
	@import 'bootstrap/scss/bootstrap.scss';
	@import '../../../assets/styles/bootstrap-override.scss';

	li { list-style: none; }
	li:nth-child(even) { background: $grey; }

	// Make Comments Wordwrapped
	.multiline { white-space: pre-wrap; }

	.unvoted {
		font-size: 1em;
		color: $white;
	}
	.unvoted:hover { color: $like; }

	.voted { color: $like; }
</style>