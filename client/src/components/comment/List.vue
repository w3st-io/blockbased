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
					<!-- Profile Section -->
					<div class="
						col-lg-2 col-md-2 col-sm-2 col-12 px-0 py-3 border-secondary
					">
						<div
							class="
								d-block
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

						<p class="m-0 mt-2 text-center text-light small">
							<span class="mark bg-primary">{{ comment.user.email }}</span>
						</p>
					</div>

					<!-- Comment Section -->
					<div class="col-lg-10 col-md-10 col-sm-10 col-12 px-2 pt-3">
						<p
							v-html="comment.text"
							class="m-0 text-light multiline comment-list"
						></p>
					</div>
				
					<!-- Bottom Bar -->
					<div class="col-12 p-2 border-top border-secondary text-light">
						<div class="w-50 m-0 float-left small text-light">
							<!-- Drop Down Menu Button Component -->
							<dropDownMenuBtn
								:disabled="disabled"
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
							<span class="ml-3">{{ comment.createdAt }}</span>
						</div>

						<!-- Buttons -->
						<div class="w-50 m-0 float-right small text-right text-secondary">
							<button
								v-if="comment.user._id == decoded._id"
								@click="redirectToEdit(comment._id)"
								class="py-0 btn btn-sm text-secondary"
							>edit</button>
							<button
								v-if="comment.user._id == decoded._id"
								@click="deleteComment(comment._id)"
								class="py-0 btn btn-sm text-danger"
							>delete</button>
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
					<div
						v-if="adminLoggedIn"
						class="col-12 p-2 border border-warning text-light"
					>
						<button
							@click="deleteComment(comment._id)"
							class="btn btn-sm btn-outline-danger"
						>Admin-Delete</button>
					</div>
				</li>
			</ul>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="comments == ''" class="my-3" />
		</section>
		
		<!-- [LOADING + ERROR] -->
		<section class="col-12">
			<div v-if="loading" class="my-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>

			<div v-if="error" class="my-3 alert alert-primary">{{ error }}</div>
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
			amount: { type: Number, required: true },
		},

		data: function() {
			return {
				decoded: {},
				adminLoggedIn: false,
				loading: true,
				disabled: false,
				comments: [],
				error: '',
			}
		},

		created: async function() {
			if (localStorage.admintoken) { this.adminLoggedIn = true }

			if (localStorage.usertoken) {
				this.decoded = await UserService.getUserTokenDecodeData()
			}
			
			// [INIT] Comments //
			await this.commentReadAll()

			
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
			async commentReadAll() {
				// Get Comments //
				try {
					const returnedData = await CommentService.s_readAll(
						this.block_id,
						this.amount,
						this.pageIndex
					)

					if (returnedData.status) { this.comments = returnedData.comments }
					else { this.error = returnedData.message }
				}
				catch(e) { this.error = e }
			},

			/******************* [CRUD] *******************/
			async deleteComment(comment_id) {
				// [DELETE] Comment //
				try { await CommentService.s_delete(comment_id) }
				catch(e) { this.error = e }

				// [READ] Comments //
				await this.commentReadAll()
			},
			
			/******************* [BTN] Like *******************/
			async likeBtn(comment) {
				// [LOG REQUIRED] //
				if (localStorage.usertoken) {
					if (comment.liked) {
						this.disabled = true

						try { await CommentService.s_unlike(comment._id) }
						catch(e) { this.error = e }

						this.disabled = false
					}
					else {
						this.disabled = true

						try { await CommentService.s_like(this.block_id, comment._id) }
						catch(e) { this.error = e }

						this.disabled = false
					}
				}

				// [READ] Update Comments //
				await this.commentReadAll()
			},

			/******************* [REPORT] *******************/
			reportInnapropiate(comment_id) {
				CommentService.s_report(this.block_id, comment_id,'Innapropiate')
			},

			reportOffensive(comment_id) {
				CommentService.s_report(this.block_id, comment_id,'Offensive')
			},

			reportScam(comment_id) {
				CommentService.s_report(this.block_id, comment_id,'Scam')
			},

			reportBot(comment_id) {
				CommentService.s_report(this.block_id, comment_id,'Bot')
			},

			reportOther(comment_id) {
				CommentService.s_report(this.block_id, comment_id,'Other')
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
				console.log('decoded:', this.decoded)
				console.log('pageIndex:', this.pageIndex)
				console.log('amount:', this.amount)
				console.log('Comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},

			/******************* [ADMINISTRATION] *******************/
			adminDelete(comment_id) {
				comment_id
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