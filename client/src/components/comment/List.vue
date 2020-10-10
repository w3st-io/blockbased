<template>
	<article class="row">
		<section class="col-12">
			<ul
				v-if="comments != ''"
				class="m-0 p-0 border border-bottom-0 border-secondary"
			>
				<li
					v-for="comment in comments"
					:key="comment._id"
					class="row m-0 border-bottom border-secondary text-light"
				>
					<!-- Profile/Timestamp Bar -->
					<div class="col-12 p-1 border-bottom border-secondary">
						<span class="small text-secondary">{{ comment.createdAt }}</span>
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
							class="m-0 multiline comment-list"
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
									:btnName="'Report'"
									:BSColor="'outline-secondary'"
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
								<!-- 	Quote -->
								<button
									@click="redirectToEdit(comment._id)"
									class="btn btn-sm btn-outline-secondary text-secondary"
								>Quote</button>
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
		</section>
	</article>
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
						params: { comment_id: comment_id, }
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
</style>