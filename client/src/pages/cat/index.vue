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
				:leftBtnEmitName="'cat-page-prev'"
				:rightBtnEmitName="'cat-page-next'"
			/>

			<button-tabs
				:tabs="['recent', 'popular']"
				:initialTab="activeTab"
				@tabClicked="tab"
				class="mx-auto mb-2"
				style="max-width: 300px;"
			/>

			<!-- Display All the Blocks -->
			<block-list
				v-if="!loading"
				:blocks="blocks"
				@refreshBlocks="blocksReadAll"
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
	import buttonTabs from '@components/controls/ButtonTabs'
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
			buttonTabs,
			NoContent,
			TitleHeader,
		},

		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				pageNumber: parseInt(this.$route.params.page),
				activeTab: 0,
				limit: 5,
				loading: true,
				data: {},
				cat: {},
				blocks: [],
				error: '',
			}
		},

		created: async function() {
			// Get Cat Details //
			this.cat = cats.find(cat => cat.cat_id === this.cat_id)

			// [--> EMMIT] cat-prev, cat-next, redirect-to-block //
			EventBus.$on('cat-page-prev', () => { this.prevPage() })
			EventBus.$on('cat-page-next', () => { this.nextPage() })

			// [LOG] //
			//this.log()
		},

		methods: {
			tab(tab) {
				console.log('tab', tab)
				
				this.loading = true

				if (tab == 'recent') {
					this.activeTab = 0
					this.$route.params.tab = 0
				}
				else {
					this.activeTab = 1
					this.$route.params.tab = 1
				}

				this.blocksReadAll()
			},

			/******************* [INIT] Block *******************/
			async blocksReadAll() {
				this.loading = true
				
				let sort = ''
				let pageIndex = this.pageNumber - 1

				if (this.activeTab == 0) { sort = 'descending' }
				else { sort = 'popularity' }

				try {
					this.data = await BlockService.s_readAll(
						this.cat_id,
						this.limit,
						pageIndex,
						sort,
					)
				}
				catch (e) { this.error = e }

				if (this.data.status) { this.blocks = this.data.blocks }
				else { this.error = this.data.message }

				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative //
				if (this.pageNumber != 1) {
					this.pageNumber--

					this.blocksReadAll()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'Cat',
						params: {
							cat_id: this.cat_id,
							page: this.pageNumber
						}
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages //
				if (this.pageNumber < this.data.pageCount) {
					this.pageNumber++

					this.blocksReadAll()
					
					// [REDIRECT] Cat Page //
					router.push({
						name: 'Cat',
						params: {
							cat_id: this.cat_id,
							page: this.pageNumber
						}
					})
				}
			},

			log() {
				console.log('%%% [PAGE] Cat %%%')
				console.log('limit:', this.limit)
				console.log('cat_id:', this.cat_id)
				console.log('pageNumber:', this.pageNumber)
				console.log('data:', this.data)
				console.log('blocks:', this.blocks)
				console.log('cat:', this.cat)
				if (this.error) { console.error('error:', this.error) }
			},
		}
	}
</script>