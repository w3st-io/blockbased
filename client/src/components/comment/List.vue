<template>
	<section class="row">
		<div v-if="!loading" class="col-12">
			<ul class="m-0 p-0 border border-secondary">
				<li
					v-for="comment in comments"
					:key="comment._id"
					class="row m-0 boder border-bottom border-secondary"
				>
					<!-- Image Section -->
					<div class="col-lg-2 col-md-2 col-sm-2 col-12 px-0 py-3 border-secondary">
						<div class="d-block m-auto rounded-lg pro-img-holder">
							<img
								:src="getProfilePic(comment.user_id)"
								class="m-auto w-100 pro-img"
							>
						</div>

						<p class="m-0 text-center text-light small">
							{{ comment.email }}
						</p>
					</div>

					<!-- Comment Section -->
					<div class="col-lg-10 col-md-10 col-sm-10 col-12 px-2 pt-3">
						<p v-html="comment.comment" class="m-0 text-light multiline"></p>
					</div>
				
					<!-- Bottom Bar -->
					<div class="col-12 p-2 border-top border-secondary text-light">
						<div class="w-50 m-0 float-left small text-light">
							<!-- Drop Down Menu Button Component -->
							<dropDownMenuBtn
								:_id="comment._id"
								:btnName="'Report'"
								:BSColor="'outline-danger'"
								:list="[
									'Innapropiate',
									'Offensive',
									'Scam',
									'Bot',
									'Other'
								]"
							/>

							<!-- Time Stamp -->
							<span class="ml-3">
								{{ comment.createdAt.toLocaleString() }}
							</span>
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
		
		<!-- [LOADING + ERROR] -->
		<div class="col-12">
			<div v-if="loading" class="my-3 alert alert-info">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>

			<div v-if="error" class="m-0 alert alert-danger">
				{{ error }}
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import dropDownMenuBtn from '@components/controls/dropDownMenuBtn'
	import router from '@router'
	import CommentService from '@services/CommentService'
	import CommentVoteService from '@services/CommentVoteService'
	import ReportService from '@services/ReportService'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'
	
	// [EXPORT] //
	export default {
		components: { dropDownMenuBtn },
		
		props: {
			block_id: { type: String, required: true, },
			pageIndex: { type: Number, required: true, },
			amountPerPage: { type: Number, required: true },
			user_id: { type: String, required: true },
			email: { type: String, required: true },
			username: { type: String, required: true },
		},

		data: function() {
			return {
				loading: true,
				disabled: false,
				comments: [],
				votesReplica: {},
				profileReplicas: [],
				error: '',
			}
		},

		created: async function() {
			// Initialize Comments //
			await this.getComments()

			// Initialize Replicas //
			this.setReplicas()

			// Initialize User Profile Pictures in ProfileReplicas //
			await this.setProfilePics()

			// Disable Loading //
			this.loading = false

			// [--> EMMIT] //
			EventBus.$on('Innapropiate', (comment_id) => {
				this.reportInnapropiate(comment_id)
			})
			EventBus.$on('Offensive', (comment_id) => {
				this.reportOffensive(comment_id)
			})
			EventBus.$on('Scam', (comment_id) => {
				this.reportScam(comment_id)
			})
			EventBus.$on('Bot', (comment_id) => {
				this.reportBot(comment_id)
			})
			EventBus.$on('Other', (comment_id) => {
				this.reportOther(comment_id)
			})

			// [LOG] //
			this.log()
		},

		methods: {
			/******************* [COMMENTS] *******************/
			async getComments() {
				// Get Comments //
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
				// [DELETE] Comment Vote //
				try { await CommentVoteService.deleteAllCommentVotes(comment_id)}
				catch (e) { this.error = e }

				// [DELETE] Comment //
				try { await CommentService.deleteComment(comment_id) }
				catch(e) { this.error = e }

				// [UPDATE] Variable on this page //
				this.getComments()
				this.setReplicas()
			},

			doesUserOwnThisComment(user_id) {
				if (user_id == this.user_id) return true
				else return false 
			},

			/******************* [REPLICAS] *******************/
			setReplicas() {
				this.comments.forEach(comment => {
					// Votes Replica //
					let insert = { voteCount: comment.voters.length, voted: false }

					if (this.searchVotersArrayInComment(comment.voters)) {
						insert = { voteCount: comment.voters.length, voted: true }
					}

					this.votesReplica[comment._id] = insert

					// Profile Replicas //
					// If the profile object isnt in the array already..
					let profileFound = this.profileReplicas.some((profile) => (
						profile.user_id === comment.user_id
					))

					if (!profileFound) {
						this.profileReplicas.push({
						user_id: comment.user_id,
						profilePicURL: require('../../assets/images/placeholder.png')
					})
					}
					
				})
			},

			/******************* [PROFILE SECTION] *******************/
			async setProfilePics() {
				this.profileReplicas.forEach(async (profile) => {
					let returnedData = await UserService.getUserProfileData(profile.user_id, 'pic')

					profile.profilePicURL = returnedData.profilePicURL
				})
			},

			getProfilePic(user_id) {
				let result = this.profileReplicas.filter(profile => {
					return profile.user_id === user_id
				})

				return result[0].profilePicURL
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
					if (this.votesReplica[comment_id].voted) { this.addVote(comment_id) }
					else { this.removeVote(comment_id) }

					// Enable Buttons //
					this.disabled = false
				}
			},

			async addVote(comment_id) {
				// [CREATE] Like in "CommentVotes" Colelction //
				try {
					await CommentVoteService.createCommentVote(this.block_id, comment_id)
				}
				catch(e) { this.error = e }

				// [UPDATE] Block Object //
				try {
					await CommentService.addVote(comment_id)
				}
				catch(e) { this.error = e }
			},

			async removeVote(comment_id) {
				// [DELETE] Like in "CommentVotes" Collection //
				try {
					await CommentVoteService.deleteCommentVote(comment_id)
				}
				catch(e) { this.error = e }
						

				// [UPDATE] Block Object //
				try {
					await CommentService.removeVote(comment_id)
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

			/******************* [REPORT] *******************/
			reportInnapropiate(comment_id) {
				ReportService.createReport(this.block_id, comment_id,'Innapropiate')
			},

			reportOffensive(comment_id) {
				ReportService.createReport(this.block_id, comment_id,'Offensive')
			},

			reportScam(comment_id) {
				ReportService.createReport(this.block_id, comment_id,'Scam')
			},

			reportBot(comment_id) {
				ReportService.createReport(this.block_id, comment_id,'Bot')
			},

			reportOther(comment_id) {
				ReportService.createReport(this.block_id, comment_id,'Other')
			},

			/******************* [ROUTER + LOG] *******************/
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
				console.log('profileReplicas:', this.profileReplicas)
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

	// Profile Image Holder // Profile Image //
	.pro-img-holder {
		max-width:100px;
		max-height:100px;
		width: auto;
		height: auto;
		overflow: hidden;
		
	}
	.pro-img {
		min-height: 100%;
		min-width: 100%;
	}
</style>