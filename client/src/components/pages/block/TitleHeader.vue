<template>
	<section class="w-100 mb-3 flex-container">
		<!-- Left Side -->
		<div class="w-50 float-left">
			<!-- Title -->
			<h3 class="text-light">{{ block.title }}</h3>

			<div class="w-50">
				<!-- Page Nav Buttons -->
				<page-nav-buttons
					:leftBtnEmitName="leftBtnEmitName"
					:rightBtnEmitName="rightBtnEmitName"
					:badgeValue="badgeValue"
				/>
			</div>
		</div>

		<!-- Right Side -->
		<div class="w-50 float-right text-right">
			<p class="mb-3 text-secondary small">
				{{ block.createdAt }}
				<span>
					<button class="ml-2 btn btn-sm btn-outline-secondary">
						Follow<span class="ml-2 badge badge-light">0</span>
					</button>
				</span>
			</p>
			
			<button
				:disabled="disabled"
				@click="redirectToBlockCommentCreate(block._id)"
				class="btn btn-info"
			>Add Comment</button>
		</div>
		<br>
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
			block_id: {
				type: String,
				required: true,
			},

			leftBtnEmitName: {
				type: String,
				required: true
			},

			rightBtnEmitName: {
				type: String,
				required: true
			},

			badgeValue: {
				required: true
			},
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
			try {
				this.block = await BlockService.getBlockDetails(this.block_id)
				
				// Enable Button
				this.disabled = false
			}
			catch(e) { this.error = e }
			
			

			this.log()
		},

		methods: {
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

<style scoped>
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: unset;
	}
</style>