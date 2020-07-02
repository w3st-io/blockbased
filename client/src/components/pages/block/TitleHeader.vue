<template>
	<section class="row">
		<!-- Left Side -->
		<div class="col-lg-6 col-md-8 col-sm-8">
			<!-- Title + Page Nav Buttons -->
			<h3 class="m-0 text-light">{{ block.title }}</h3>
			<p class="text-secondary">created by: {{ block.username }}</p>

			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="col-lg-6 col-md-4 col-sm-4 text-right">
			<p class="mb-3 text-secondary small hide-the-ugly">
				{{ block.createdAt }}
			</p>
			
			<div class="mb-3 hide-the-ugly">
				<span>
					<button class="ml-2 btn btn-sm btn-outline-secondary">
						Follow<span class="ml-2 badge badge-light">0</span>
					</button>
				</span>
			</div>
			
			<button
				:disabled="disabled"
				@click="redirectToBlockCommentCreate(block._id)"
				class="btn btn-info"
			>Add Comment</button>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '@components/controls/PageNavButtons'
	import router from '@router'
	import BlockService from '@services/BlockService'

	// [EXPORT] //
	export default {
		components: {
			PageNavButtons
		},
		
		props: {
			block_id: { type: String, required: true, },
			leftBtnEmitName: { type: String, required: true, },
			rightBtnEmitName: { type: String, required: true, },
			badgeValue: { required: true, },
		},

		data: function() {
			return {
				disabled: true,
				pageNumber: (this.$route.params.page),
				block: {},
			}
		},

		created: async function() {
			// Get Block Details //
			await this.getBlockDetails()
			
			// [LOG] //
			//this.log()
		},

		methods: {
			async getBlockDetails() {
				try {
					this.block = await BlockService.getBlockDetails(this.block_id)
					
					// Enable Button //
					this.disabled = false
				}
				catch(e) { this.error = e }
			},

			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			},

			log() {
				console.log('%%% [COMPONENT] TitleHeader %%%')
				console.log('block_id:', this.block_id)
				console.log('block:', this.block)
			},
		},
	}
</script>

<style lang="scss" scoped>
	// Small devices (landscape phones, 576px and up)
	@media (max-width: 767.98px) { 
		.hide-the-ugly { display: none; }
	}
</style>