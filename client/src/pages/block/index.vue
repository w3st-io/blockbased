<template>
	<section class="my-4 container">
		<!-- Set Page Title -->
		<vue-headful :title="`Post - ${block.title}`"/>
		
		<article class="card card-body bg-dark">
			<!-- Title Header -->
			<title-header
				:block="block"
				:leftBtnEmitName="'block-page-prev'"
				:rightBtnEmitName="'block-page-next'"
				:badgeValue="pageNumber"
				@refreshBlock="blockRead()"
				class="mb-3"
			/>

			<!-- Comments List -->
			<comment-list
				v-if="!loading"
				:comments="comments"
				:block_id="block_id"
				@refreshComments="commentReadAll()"
			/>

			<!-- [DEFAULT] If No content -->
			<no-content v-if="!loading && comments == ''" class="my-3" />
			
			<!-- [LOADING + ERROR] -->
			<section class="col-12">
				<div v-if="loading" class="my-3 alert alert-primary">
					<div class="d-flex justify-content-center">
						<div class="spinner-grow"></div>
					</div>
				</div>
			</section>

			<!-- Botton Page Control -->
			<section class="mt-3">
				<page-nav-buttons
					:leftBtnEmitName="'block-page-prev'"
					:rightBtnEmitName="'block-page-next'"
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
	import NoContent from '@components/placeholders/NoContent'
	import router from '@router'
	import BlockService from '@services/BlockService'
	import CommentService from '@services/CommentService'
	import { EventBus } from '@main'


	// [EXPORT] //
	export default {
		components: {
			CommentList,
			TitleHeader,
			NoContent,
			PageNavButtons,
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: parseInt(this.$route.params.page),
				limit: 5,
				existance: false,
				loading: true,
				returned: {},
				block: {},
				comments: [],
				error: '',
			}
		},

		created: async function() {
			// [UPDATE] //
			await this.blockRead()

			// [INIT] Comments //
			if (!this.error) await this.commentReadAll()

			// [--> EMMIT] block-prev, block-next //
			EventBus.$on('block-page-prev', () => { this.prevPage() })
			EventBus.$on('block-page-next', () => { this.nextPage() })

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
				// Enable Loading //
				this.loading = true

				let pageIndex = this.pageNumber - 1

				// [READ] Comments //
				try {
					const returned = await CommentService.s_readAll(
						this.block_id,
						this.limit,
						pageIndex
					)
					console.log(returned);
					if (returned.status) { this.comments = returned.comments }
					else { this.error = returned.message }
				}
				catch (e) { this.error = e }

				// Disable Loading //
				this.loading = false
			},

			prevPage() {
				// As long as the page is not going into 0 or negative
				if (this.pageNumber != 1) {
					this.pageNumber--

					this.commentReadAll()

					router.push({
						name: 'Block',
						params: {
							block_id: this.block_id,
							page: this.pageNumber
						}
					})
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages
				if (this.pageNumber == this.pageNumber) {
					this.pageNumber++

					this.commentReadAll()

					router.push({
						name: 'Block',
						params: {
							block_id: this.block_id,
							page: this.pageNumber
						}
					})
				}
			},

			log() {
				console.log('%%% [PAGE] Block %%%')
				console.log('block_id:', this.block_id)
				console.log('block:', this.block)
				console.log('comments:', this.comments)
				console.log('existance:', this.existance)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>