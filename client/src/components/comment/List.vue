<template>
	<BRow>
		<BCol cols="12">
			<ul
				v-if="comments != ''"
				class="m-0 p-0 border border-bottom-0 border-secondary"
			>
				<li
					v-for="comment in comments"
					:key="comment._id"
					class="comment row m-0 border-bottom border-secondary text-light"
				>
					<!-- Profile/Timestamp Bar -->
					<div class="col-6 p-1 border-bottom border-secondary">
						<span class="small text-secondary">
							{{ new Date(comment.createdAt).toLocaleString() }}
						</span>
					</div>

					<div class="col-6 p-1 border-bottom border-secondary text-right">
						<!-- In Reply to Comment Btn -->
						<button
							v-if="comment.replyToComment != null"
							@click="toggleOpenRepliedTo(comment._id)"
							class="btn btn-sm dropdown-toggle"
							:class="{
								'btn-outline-secondary': openedRepliedTo != comment._id,
								'btn-outline-primary': openedRepliedTo == comment._id,
							}"
						>In Reply to Comment</button>
					</div>

					<div
						v-if="comment.replyToComment != null"
						v-show="openedRepliedTo == comment._id"
						class="col-12 p-1 border-bottom border-secondary"
					>
						<p class="small text-secondary">
							{{ comment.replyToComment.user.username }} -
							{{
								new Date(comment.replyToComment.createdAt).toLocaleString()
							}}
							:
						</p>
						<p
							v-html="comment.replyToComment.text"
							class="m-0 multiline small"
						></p>
					</div>

					<!-- Profile Section -->
					<div class="col-lg-2 col-md-2 col-sm-2 col-12 px-0 py-3 border-secondary">
						<div
							class="
								m-auto
								border
								border-primary
								rounded-lg
								pro-img-holder
							"
						>
							<img
								:src="comment.user.profileImg"
								class="m-auto w-100 pro-img"
							>
						</div>

						<p class="m-0 mt-2 text-center small">
							<span class="mark bg-primary">{{ comment.user.username }}</span>
						</p>
					</div>

					<!-- Comment Section -->
					<div class="col-lg-10 col-md-10 col-sm-10 col-12 px-2 pt-3">
						<p
							v-html="comment.text"
							class="m-0 multiline"
						></p>
					</div>
				
					<!-- Bottom Bar -->
					<div class="col-12 p-2 border-top border-secondary">
						<div class="row">
							<!-- Left -->
							<div class="col-4 m-0 small">
								<!-- [COMPONENT] Drop Down Menu Button -->
								<DropDownMenuBtn
									:disabled="disabled"
									:_id="comment._id"
									btnName="Report"
									BSColor="outline-secondary"
									:list="[
										'Innapropiate',
										'Offensive',
										'Scam',
										'Bot',
										'Other'
									]"
									@ddmb-clicked="report"
								/>

								<!-- Edit -->
								<button
									v-if="comment.user._id == decoded.user_id"
									@click="redirectToEdit(comment._id)"
									class="py-0 btn btn-sm text-secondary"
								>Edit</button>
							</div>
							
							<!-- Middle -->
							<div class="col-4 text-center">
								<!-- Reply -->
								<button
									@click="redirectToReply(comment._id)"
									class="btn btn-sm btn-outline-secondary text-secondary"
								>Reply</button>
							</div>

							<!-- Right -->
							<div class="col-4 m-0 text-right small text-secondary">
								<!-- Like Btn -->
								<button
									@click="likeBtn(comment)"
									class="btn"
									:class="{
										'btn-outline-success': comment.liked,
										'btn-outline-light': !comment.liked
									}"
									style="font-size: 1em;"
								>{{ comment.likeCount }} ▲</button>
							</div>
						</div>
					</div>

					<!-- Admin Bar -->
					<div
						v-if="adminLoggedIn"
						class="col-12 p-2 border border-warning"
					>
						<button
							@click="redirectToEdit(comment._id)"
							class="mr-1 btn btn-sm btn-outline-secondary"
						>Edit</button>

						<button
							@click="deleteComment(comment._id)"
							class="mr-1 btn btn-sm btn-outline-danger"
						>Delete</button>
						
						<button
							@click="adminDelete(comment._id)"
							class="btn btn-sm btn-outline-danger"
						>Admin-Delete</button>

						<span class="ml-1 small text-secondary">{{ comment._id }}</span>
					</div>
				</li>
			</ul>
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import DropDownMenuBtn from '@components/controls/DropDownMenuBtn'
	import router from '@router'
	import CommentService from '@services/CommentService'
	import ACommentService from '@services/administration/CommentService'
	import UserService from '@services/UserService'
	
	// [EXPORT] //
	export default {
		components: {
			DropDownMenuBtn,
		},
		
		props: {
			post_id: { type: String, required: true, },
			comments: { type: Array, required: true, },
		},

		data: function() {
			return {
				decoded: {},
				adminLoggedIn: false,
				disabled: false,
				openedRepliedTo: null,
				error: '',
			}
		},

		created: async function() {
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			if (localStorage.usertoken) {
				this.decoded = await UserService.getUserTokenDecodeData()
			}

			// [LOG] //
			//this.log()
		},

		methods: {	
			/******************* [DELETE] *******************/
			async deleteComment(comment_id) {
				// [DELETE] Comment //
				try { await CommentService.s_delete(comment_id) }
				catch (err) { this.error = err }

				// [EMIT] Refresh Comments //
				this.$emit('refreshComments') 
			},

			async adminDelete(comment_id) {
				// [DELETE] Comment //
				try { await ACommentService.s_delete(comment_id) }
				catch (err) { this.error = err }

				// [EMIT] Refresh Comments //
				this.$emit('refreshComments') 
			},
			
			/******************* [BTN] Like *******************/
			async likeBtn(comment) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					if (comment.liked) {
						this.disabled = true

						try { await CommentService.s_unlike(comment._id) }
						catch (err) { this.error = err }

						this.disabled = false
					}
					else {
						this.disabled = true

						try { await CommentService.s_like(this.post_id, comment._id) }
						catch (err) { this.error = err }

						this.disabled = false
					}
				}

				// [READ] Update Comments //
				this.$emit('refreshComments') 
			},

			/******************* [BTN] openRepliedTo *******************/
			toggleOpenRepliedTo(comment_id) {
				if (this.openedRepliedTo == comment_id) { this.openedRepliedTo = null }
				else { this.openedRepliedTo = comment_id }
			},

			/******************* [REPORT] *******************/
			report(type, comment_id) {
				CommentService.s_report(this.post_id, comment_id, type)
			},

			/******************* [ROUTER + LOG] *******************/
			redirectToEdit(comment_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'comment-edit',
						params: { comment_id, }
					})
				}
			},

			redirectToReply(comment_id) {
				if (!this.disabled) {
					// [REDIRECT] //
					router.push({
						name: 'comment-reply',
						params: { comment_id, }
					})
				}
			},

			log() {
				console.log('%%% [COMPONENT] CommentList %%%')
				console.log('decoded:', this.decoded)
				console.log('Comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>

<style lang="scss" scoped>
	// [IMPORT] Personal //
	@import 'src/assets/styles/sass-variables.scss';

	li { list-style: none; }
	li:nth-child(even) { background: $backgroundGrey !important; }

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

	// Comment List Image Fix //
	.comment img { max-width: 100%; }

	// Distinct blockquotes //
	.comment blockquote {
		margin: 0;
		padding: 0px 10px;
		background-color: rgba(0, 0, 0, 0.171);
		border-color: #535353;
		border-style: solid;
		border-width: 1px;
	}

	// Distinct p //
	.comment p { margin: 0; }
</style>