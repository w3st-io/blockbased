<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Post - ${block.title}`"/>

		<article class="card card-body bg-dark">
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
				:amount="5"
			/>
		</article>

		<!-- Botton Page Control -->
		<article class="mt-3">
			<div class="row">
				<page-nav-buttons
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
					class="col-lg-6 col-md-12"
				/>
			</div>
		</article>

		<!-- [ALERTS] -->
		<div>
			<div v-if="!loading && !existance && !error" class="row mt-3 alert alert-warning">
				Block Does Not Exist.
			</div>

			<div v-if="error" class="row mt-3 alert alert-danger">
				Block Page {{ error }}
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import TitleHeader from '@components/block/TitleHeader'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			CommentList,
			TitleHeader,
			PageNavButtons,
		},

		data: function() {
			return {
				existance: false,
				loading: true,
				block_id: this.$route.params.block_id,
				block: {},
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				commentListKey: 0,
				error: '',
			}
		},

		created: async function() {
			// Check If Block Is Valid //
			try { this.existance = await BlockService.s_existance(this.block_id) }
			catch(e) { this.error = e }

			if (this.existance) {
				// [--> EMMIT] block-prev, block-next //
				EventBus.$on('block-prev', () => { this.prevPage() })
				EventBus.$on('block-next', () => { this.nextPage() })

				// [UPDATE] //
				try { await this.blockRead() }
				catch(e) { this.error = e }
			}

			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			async blockRead() {
				try { this.block = await BlockService.s_read(this.block_id) }
				catch(e) { this.error = e }
			},

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
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>