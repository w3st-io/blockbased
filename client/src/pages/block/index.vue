<template>
	<section class="container">
		<article v-if="existance" class="row">
			<div class="col-12 my-4 card card-body bg-dark">
				<!-- Title Header -->
				<title-header
					:block_id="block_id"
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
				/>

				<!-- Comments -->
				<Block-comment-list
					:block_id="block_id"
					:pageIndex="pageIndex"
					:amountPerPage="5"
					:user_id="user_id"
					:email="email"
					:username="username"
				/>

				<!-- Bottom Page Control -->
				<div class="mt-2 w-25">
					<page-nav-buttons
						:leftBtnEmitName="'block-prev'"
						:rightBtnEmitName="'block-next'"
						:badgeValue="pageNumber"
					/>
				</div>
				

				<!-- [ERROR] -->
				<div v-if="error" class="alert alert-danger">
					{{ error }}
				</div>
			</div>
		</article>

		<div v-if="error" class="row mt-3 alert alert-warning">
			Hey! This Block Doesnt Exist!
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import BlockCommentList from '@components/pages/block/BlockCommentList'
	import TitleHeader from '@components/pages/block/TitleHeader'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import UserService from '@services/UserService'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			BlockCommentList,
			TitleHeader,
			PageNavButtons,
		},

		data: function() {
			return {
				existance: false,
				loading: true,
				userTokenDecodeData: {},
				block_id: this.$route.params.block_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				error: '',
			}
		},

		created: async function() {
			// Check if Block is valid
			this.existance = await BlockService.validateExistance(this.block_id)

			if (this.existance) {
				// Retrieve User Data //
				try {
					this.userTokenDecodeData = await UserService.getUserTokenDecodeData()
					this.user_id = this.userTokenDecodeData._id
					this.email = this.userTokenDecodeData.email
					this.username = this.userTokenDecodeData.username
				}
				catch(e) { this.error = e }

				// [--> EMMIT] block-prev, block-next //
				EventBus.$on('block-prev', () => { this.prevPage() })
				EventBus.$on('block-next', () => { this.nextPage() })

				// [LOG] //
				//this.log()
			}
			else { this.error = 'Block Doesnt Exist!' }
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
					router.push({ path: `/block/${this.block_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},

			log() {
				console.log('%%% [PAGE] Block %%%')
				console.log('block_id:', this.block_id)
				console.log('existance:', this.existance)
				console.log('pageIndex:', this.pageIndex)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>