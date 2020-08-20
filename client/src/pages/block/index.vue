<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Post - ${block.title}`"/>
		
		<article class="card card-body bg-dark">
			<!-- Title Header -->
			<title-header
				:block="block"
				:leftBtnEmitName="'block-prev'"
				:rightBtnEmitName="'block-next'"
				:badgeValue="pageNumber"
				class="mb-3"
				@refreshBlock="blockRead()"
			/>

			<!-- Comments List -->
			<comment-list
				:comments="comments"
				:block_id="block_id"
				:pageIndex="pageIndex"
				@refreshComments="commentReadAll()"
			/>
		
			<!-- Botton Page Control -->
			<section class="mt-3">
				<page-nav-buttons
					:leftBtnEmitName="'block-prev'"
					:rightBtnEmitName="'block-next'"
					:badgeValue="pageNumber"
					class="m-auto w-100"
					style="max-width: 300px;"
				/>
			</section>
		</article>

		<!-- [ALERTS] -->
		<div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import CommentList from '@components/comment/List'
	import TitleHeader from '@components/block/TitleHeader'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
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
				returned: {},
				block_id: this.$route.params.block_id,
				block: {},
				comments: [],
				pageNumber: parseInt(this.$route.params.page),
				pageIndex: parseInt(this.$route.params.page - 1),
				amount: 5,
				commentListKey: 0,
				error: '',
			}
		},

		created: async function() {
			// [UPDATE] //
			await this.blockRead()

			// [INIT] Comments //
			if (!this.error) await this.commentReadAll()

			// [--> EMMIT] block-prev, block-next //
			EventBus.$on('block-prev', () => { this.prevPage() })
			EventBus.$on('block-next', () => { this.nextPage() })


			// Disable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			async blockRead() {
				// Check If Block Is Valid //
				try { this.existance = await BlockService.s_existance(this.block_id) }
				catch (e) { this.error = e }

				if (this.existance) {
					try { this.returned = await BlockService.s_read(this.block_id) }
					catch (e) { this.error = e }
	
					if (this.returned.status) { this.block = this.returned.block }
					else { this.error = this.returned.message }
				}
			},

			/******************* [INIT] Comments *******************/
			async commentReadAll() {
				// Get Comments //
				try {
					const returned = await CommentService.s_readAll(
						this.block_id,
						this.amount,
						this.pageIndex
					)

					if (returned.status) { this.comments = returned.comments }
					else { this.error = returned.message }
				}
				catch (e) { this.error = e }
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
				console.log('block:', this.block)
				console.log('comments:', this.comments)
				console.log('existance:', this.existance)
				console.log('pageIndex:', this.pageIndex)
				console.log('commentListKey:', this.commentListKey)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>