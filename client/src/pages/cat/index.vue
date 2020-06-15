<template>
	<section class="container">
		<article class="row">
			<div class="col-12 my-4 card bg-dark card-body">
				<!-- Title With Create Button -->
				<title-header
					:cat_id="cat_id"
					:leftBtnEmitName="'cat-prev'"
					:rightBtnEmitName="'cat-next'"
					:badgeValue="pageNumber"
				/>

				<!-- Display All the Blocks -->
				<cat-block-list
					:username="username"
					:blocks="blocks"
				/>

				<!-- [ERROR] -->
				<div v-if="error" class="alert alert-danger">
					{{ error }}
				</div>
			</div>
		</article>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import CatBlockList from '@components/pages/cat/CatBlockList'
	import TitleHeader from '@components/pages/cat/TitleHeader'
	import BlockService from '@services/BlockService'
	import UserService from '@services/UserService'
	import router from '@router'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		components: {
			CatBlockList,
			TitleHeader,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				amountPerPage: 5,
				blocks: [],
				error: '',
			}
		},

		created: async function() {
			// Retrieve Email //
			this.user_id = UserService.getUserId()
			this.email = UserService.getEmail()
			this.username = UserService.getUsername()

			// [--> EMMIT] cat-prev, cat-next, redirect-to-block //
			EventBus.$on('cat-prev', () => { this.prevPage() })
			EventBus.$on('cat-next', () => { this.nextPage() })
			EventBus.$on('redirect-to-block', (block_id) => { this.redirectToBlock(block_id) })

			// Get Cat Details //
			// Work is progress..

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
			log() {
				console.log('%% Cat Index %%')
				console.log('pageNumber:', this.pageNumber)
				console.log('pageIndex:', this.pageIndex)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				console.log('blocks:', this.blocks)
				if (this.error) { console.error('Error:', this.error) }
			},

			prevPage() {
				this.pageIndex++
				
				// As long as the page is not going into 0 or negative //
				if (this.pageIndex != 1) {
					this.pageIndex--
					router.push({ path: `/cat/${this.cat_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},

			nextPage() {
				this.pageIndex++

				// As long as page does not exceed max Number of Pages //
				if (this.pageIndex == this.pageIndex) {
					this.pageIndex++

					console.log('pg', this.pageIndex)
					router.push({ path: `/cat/${this.cat_id}/${this.pageIndex}` })
					EventBus.$emit('force-rerender')
				}
			},

			redirectToBlock(block_id) {
				router.push({ name: 'Block', params: { block_id: block_id, page: 1 } })
			}
		}
	}
</script>