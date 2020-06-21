<template>
	<section class="row">
		<div class="col-12">
			<ul class="m-0 p-0 border border-secondary">
				<li
					v-for="comment in comments"
					:key="comment._id"
					class="boder border-bottom border-secondary"
				>
					<article class="d-flex w-100">
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

					<div class="w-100 p-2 d-flex border-top border-secondary text-light">
						<!-- Time Stamp -->
						<div class="w-50 m-0 float-left small text-secondary">
							{{ new Date(comment.createdAt) }}
							
						</div>

						<!-- Buttons -->
						<div class="w-50 m-0 float-right small text-right text-secondary">
							<button
								v-if="doesUserOwnThisComment(comment.user_id)"
								@click="redirectToEdit(comment._id)"
								class="py-0 btn btn-sm text-secondary"
							>edit</button>
							<button
								v-if="doesUserOwnThisComment(comment.user_id)"
								@click="deleteComment(comment._id)"
								class="py-0 btn btn-sm text-danger"
							>delete</button>
							<button
								v-else
								class="py-0 btn btn-sm text-danger"
							>report</button>
							
							<button
								:disabled="disabled"
								@click="voteToggle(comment._id)"
								class="btn btn-outline-secondary unvoted"
								:class="{ 'voted': votesReplica[comment._id].voted }"
							>{{ votesReplica[comment._id].voteCount }} ▲</button>
						</div>
					</div>
				</li>
			</ul>
		</div>
		
		<div v-if="loading" class="col-12 alert alert-warning">
			Loading..
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
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
				loading: true,
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
				let insert = { voteCount: comment.voteCount, voted: false }

				if (this.searchVotersArrayInComment(comment.voters)) {
					insert = { voteCount: comment.voteCount, voted: true }
				}

				this.votesReplica[comment._id] = insert
			})

			// Disable Loading //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [COMMENT] *******************/
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

			async deleteComment(comment_id) {
				await CommentVotesService.removeCommentVotes(comment_id)
				await CommentService.deleteComment(comment_id)
				this.getComments()
			},

			doesUserOwnThisComment(user_id) {
				if (user_id == this.user_id) return true
				else return false 
			},

			/******************* [VOTE SYSTEM] *******************/
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
					await CommentVotesService.removeUsersCommentVote(
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

			/******************* [ROUTER] *******************/
			redirectToEdit(comment_id) {
				router.push(
					{
						name: 'CommentEdit',
						params: { comment_id: comment_id, }
					}
				)
			},

			log() {
				console.log('%%% [COMPONENT] CommentList %%%')
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
	// [IMPORT] Personal //
	@import 'src/assets/styles/sass-variables.scss';

	li { list-style: none; }
	li:nth-child(even) { background: $grey; }

	// Make Comments Wordwrapped
	.multiline { white-space: pre-wrap; }

	.unvoted {
		font-size: 1em;
		color: white;

		&:hover { color: $like; }
	}

	.voted { color: $like; }
</style>