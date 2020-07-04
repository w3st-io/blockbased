<template>
	<section class="my-4">
		<article class="container card card-body bg-dark">
			<!-- Title Header -->
			<title-header
				:block_id="block_id"
				:leftBtnEmitName="'block-prev'"
				:rightBtnEmitName="'block-next'"
				:badgeValue="pageNumber"
				class="mb-3"
			/>

			<!-- Comments List -->
			<comment-list
				:block_id="block_id"
				:pageIndex="pageIndex"
				:amountPerPage="5"
				:user_id="user_id"
				:email="email"
				:username="username"
			/>
		</article>

		<!-- Botton Page Control -->
		<article class="container mt-3">
			<div class="row">
				<page-nav-buttons
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
					class="col-lg-6 col-md-12"
				/>
			</div>
		</article>

		<!-- [STATUS + ERROR] -->
		<div class="container">
			<div v-if="!loading && !existance" class="row mt-3 alert alert-warning">
				Block Does Not Exist.
			</div>

			<div v-if="error" class="row mt-3 alert alert-danger">
				Block Page {{ error }}
			</div>

			<pop-up-banner
				v-show="message"
				:message="message"
				:BSColor="'info'"
			/>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import PopUpBanner from '@components/misc/PopUpBanner'
	import TitleHeader from '@components/pages/block/TitleHeader'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			CommentList,
			TitleHeader,
			PageNavButtons,
			PopUpBanner,
		},

		data: function() {
			return {
				existance: false,
				loading: true,
				userTokenDecodeData: {},
				block_id: this.$route.params.block_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				commentListKey: 0,
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				error: '',
				message: '',
			}
		},

		created: async function() {
			// Check If Block Is Valid //
			try {
				this.existance = await BlockService.validateExistance(this.block_id)
			}
			catch(e) { this.error = e }

			if (this.existance) {
				// Retrieve User Data //
				try {
					this.decoded = await UserService.getUserTokenDecodeData()
					this.user_id = this.decoded._id
					this.email = this.decoded.email
					this.username = this.decoded.username
				}
				catch(e) { this.error = e }

				// [--> EMMIT] block-prev, block-next //
				EventBus.$on('block-prev', () => { this.prevPage() })
				EventBus.$on('block-next', () => { this.nextPage() })
			}

			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			prevPage() {
				this.pageIndex++

				// As long as the page is not going into 0 or negative
				if (this.pageIndex != 1) {
					this.pageIndex--
					router.push({ path: `/block/${this.block_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},

			nextPage() {
				this.pageIndex++

				// As long as page does not exceed max Number of Pages
				if (this.pageIndex == this.pageIndex) {
					this.pageIndex++
					this.pageNumber++
					router.push({ path: `/block/${this.block_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},

			log() {
				console.log('%%% [PAGE] Block %%%')
				console.log('block_id:', this.block_id)
				console.log('existance:', this.existance)
				console.log('pageIndex:', this.pageIndex)
				console.log('commentListKey:', this.commentListKey)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>