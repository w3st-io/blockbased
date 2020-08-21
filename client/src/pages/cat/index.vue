<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Cat - ${cat.title}`"/>

		<article class="card card-body bg-dark">
			<!-- Title With Create Button -->
			<title-header
				:cat="cat"
				:postCount="data.blockCount"
				:badgeValue="pageNumber"
				:leftBtnEmitName="'cat-prev'"
				:rightBtnEmitName="'cat-next'"
			/>

			<!-- Display All the Blocks -->
			<block-list
				:blocks="blocks"
				@refreshBlocks="blocksReadAll()"
			/>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="!loading && blocks == ''" class="mt-3" />

			<!-- [LOADING] -->
			<div v-show="loading" class="m-0 mt-3 alert alert-primary">
				<div class="d-flex justify-content-center">
					<div class="spinner-grow"></div>
				</div>
			</div>
		</article>

		<!-- [ALERTS] -->
		<div v-show="error" class="mt-3 alert alert-danger">
			Cat Page: {{ error }}
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import BlockList from '@components/block/List'
	import TitleHeader from '@components/cat/TitleHeader'
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import { EventBus } from '@main'
	import { cats } from '@defaults/cats'

	// [EXPORT] //
	export default {
		components: {
			BlockList,
			NoContent,
			TitleHeader,
		},

		data: function() {
			return {
				loading: true,
				amount: 5,
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				cat: {},
				data: {},
				blocks: [],
				error: '',
			}
		},

		created: async function() {
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)

			// [INIT] Blocks //
			await this.blocksReadAll()

			this.loading = false

			// [--> EMMIT] cat-prev, cat-next, redirect-to-block //
			EventBus.$on('cat-prev', () => { this.prevPage() })
			EventBus.$on('cat-next', () => { this.nextPage() })

			// [LOG] //
			//this.log()
		},

		methods: {
			/******************* [INIT] Block *******************/
			async blocksReadAll() {
				try {
					this.data = await BlockService.s_readAll(
						this.cat_id,
						this.amount,
						this.pageIndex
					)
				}
				catch (e) { this.error = e }

				if (this.data.status) { this.blocks = this.data.blocks }
				else { this.error = this.data.message }
			},

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
				if (this.pageNumber < this.data.pageCount) {
					this.pageNumber++

					router.push({ path: `/cat/${this.cat_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('amount:', this.amount)
				console.log('cat_id:', this.cat_id)
				console.log('pageIndex:', this.pageIndex)
				console.log('pageNumber:', this.pageNumber)
				console.log('data:', this.data)
				console.log('blocks:', this.blocks)
				console.log('cat:', this.cat)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>