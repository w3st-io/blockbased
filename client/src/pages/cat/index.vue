<template>
	<section class="my-4">
		<article class="container card card-body bg-dark">
			<!-- Title With Create Button -->
			<title-header
				:cat_id="cat_id"
				:badgeValue="pageNumber"
				:leftBtnEmitName="'cat-prev'"
				:rightBtnEmitName="'cat-next'"
				class="mb-3"
			/>

			<!-- Display All the Blocks -->
			<block-list
				:cat_id="cat_id"
				:pageIndex="pageIndex"
				:amountPerPage="5"
				:user_id="user_id"
				:email="email"
				:username="username"
				class="mb-3"
			/>

			<!-- [ERROR] -->
			<div v-if="error" class="alert alert-danger">
				Cat: {{ error }}
			</div>
		</article>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockList from '@components/block/List'
	import TitleHeader from '@components/pages/cat/TitleHeader'
	import UserService from '@services/UserService'
	import router from '@router'
	import { EventBus } from '@main'

	// [EXPORT] //
	export default {
		components: {
			BlockList,
			TitleHeader,
		},

		data: function() {
			return {
				userTokenDecodeData: {},
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				user_id: 'unset',
				email: 'unset',
				username: 'unset',
				error: '',
			}
		},

		created: async function() {
			// Retrieve User Data //
			try {
				let userTokenDecodeData = UserService.getUserTokenDecodeData()
				this.user_id = userTokenDecodeData._id
				this.email = userTokenDecodeData.email
				this.username = userTokenDecodeData.username
			}
			catch(e) { this.error = e }

			// [--> EMMIT] cat-prev, cat-next, redirect-to-block //
			EventBus.$on('cat-prev', () => { this.prevPage() })
			EventBus.$on('cat-next', () => { this.nextPage() })

			// Get Cat Details //
			// Work is progress..

			// [LOG] //
			this.log()
		},

		methods: {
			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.pageNumber--

					router.push({ path: `/cat/${this.cat_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber == this.pageNumber) {
					this.pageNumber++

					router.push({ path: `/cat/${this.cat_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('cat_id:', this.cat_id)
				console.log('pageNumber:', this.pageNumber)
				console.log('pageIndex:', this.pageIndex)
				console.log('user_id:', this.user_id)
				console.log('email:', this.email)
				console.log('username:', this.username)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>