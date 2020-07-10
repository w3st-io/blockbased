<template>
	<article class="row">
		<section v-if="!loading" class="col-12">
			<ul
				v-if="comments != ''"
				class="m-0 p-0 border border-bottom-0 border-secondary"
			>
				<li
					v-for="comment in comments"
					:key="comment._id"
					class="row m-0 boder border-bottom border-secondary"
				>
					<!-- Image Section -->
					<div class="
						col-lg-2 col-md-2 col-sm-2 col-12 px-0 py-3 border-secondary
					">
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
								{{ comment.createdAt }} - {{ comment._id }}
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
								@click="voteBtn(comment)"
								class="btn"
								:class="{
									'btn-outline-success': checkForUserVote(comment),
									'btn-outline-secondary': !checkForUserVote(comment)
								}"
								style="font-size: 1em;"
							>{{ comment.voters.length }} ▲</button>
						</div>
					</div>
				</li>
			</ul>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="comments == ''" />
		</section>
		
		<!-- [LOADING + ERROR] -->
		<section class="col-12">
			<div v-if="loading" class="my-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		</section>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import dropDownMenuBtn from '@components/controls/dropDownMenuBtn'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import CommentService from '@services/CommentService'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'
	
	// [EXPORT] //
	export default {
		components: {
			dropDownMenuBtn,
			NoContent,
		},
		
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
				profileReplicas: [],
				error: '',
			}
		},

		created: async function() {
			// [INIT] Comments //
			await this.getComments()

			// [INIT] Replicas //
			this.SetProfileReplicas()

			// [INIT] User Profile Pictures //
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
			/******************* [INIT] Comments *******************/
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
				// [DELETE] Comment //
				try { await CommentService.deleteComment(comment_id) }
				catch(e) { this.error = e }

				// [READ] Comments //
				await this.getComments()
			},

			doesUserOwnThisComment(user_id) {
				if (user_id == this.user_id) return true
				else return false 
			},

			/******************* [INIT] Replicas *******************/
			SetProfileReplicas() {
				this.comments.forEach((comment) => {
					// If the profile object isnt in the array already..
					let profileFound = this.profileReplicas.some(
						(profile) => (profile.user_id === comment.user_id)
					)

					if (!profileFound) {
						this.profileReplicas.push({
							user_id: comment.user_id,
							profilePicURL: require('../../assets/images/placeholder.png')
						})
					}
				})
			},

			/******************* [INIT] Profile *******************/
			async setProfilePics() {
				this.profileReplicas.forEach(async (profile) => {
					let returnedData = await UserService.getUserProfileData(
						profile.user_id,
						'pic'
					)

					profile.profilePicURL = returnedData.profilePicURL
				})
			},

			getProfilePic(user_id) {
				let result = this.profileReplicas.filter(profile => {
					return profile.user_id === user_id
				})

				return result[0].profilePicURL
			},

			/******************* [INIT] Vote *******************/
			checkForUserVote(comment) {
				// Search For Voters Id in Block's Object //
				let found = comment.voters.find((voter) => (
					voter.user_id == this.user_id
				))

				if (found) { return true }
				else { return false }
			},
			
			/******************* [BTN] Vote *******************/
			voteBtn(comment) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					if (this.checkForUserVote(comment)) { this.removeVote(comment) }
					else { this.addVote(comment) }		
				}
			},

			async addVote(comment) {
				this.disabled = true

				// [CREATE] Like in "CommentVotes" Colelction //
				try { await CommentService.addVote(this.block_id, comment._id) }
				catch(e) { this.error = e }

				// [READ] Update Comments //
				await this.getComments()

				this.disabled = false
			},

			async removeVote(comment) {
				this.disabled = true

				// [DELETE] Like in "CommentVotes" Collection //
				try { await CommentService.removeVote(comment._id) }
				catch(e) { this.error = e }

				// [READ] Update Comments //
				await this.getComments()

				this.disabled = false
			},

			/******************* [REPORT] *******************/
			reportInnapropiate(comment_id) {
				CommentService.report(this.block_id, comment_id,'Innapropiate')
			},

			reportOffensive(comment_id) {
				CommentService.report(this.block_id, comment_id,'Offensive')
			},

			reportScam(comment_id) {
				CommentService.report(this.block_id, comment_id,'Scam')
			},

			reportBot(comment_id) {
				CommentService.report(this.block_id, comment_id,'Bot')
			},

			reportOther(comment_id) {
				CommentService.report(this.block_id, comment_id,'Other')
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToEdit(comment_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'CommentEdit',
						params: { comment_id: comment_id, }
					})
				}
			},

			log() {
				console.log('%%% [COMPONENT] CommentList %%%')
				console.log('pageIndex:', this.pageIndex)
				console.log('amountPerPage:', this.amountPerPage)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				console.log('Comments:', this.comments)
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