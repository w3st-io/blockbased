<template>
	<section class="w-100 mb-3 flex-container">
		<!-- Left Side -->
		<div class="w-50 float-left">
			<!-- Title -->
			<h3 class="text-light">
				{{ block.title }}
			</h3>

			<!-- Page Nav Buttons -->
			<page-nav-buttons
				:leftBtnEmitName="leftBtnEmitName"
				:rightBtnEmitName="rightBtnEmitName"
				:badgeValue="badgeValue"
			/>
		</div>

		<!-- Right Side -->
		<div class="w-50 float-right text-right">
			<p class="mb-3 text-secondary small">{{ block.createdAt }}</p>
			<button
				@click="redirectToBlockCommentCreate(block._id)"
				class="btn btn-info"
			>Add Comment</button>
		</div>
		<br>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import PageNavButtons from '../controls/PageNavButtons'
	import router from '../../router'

	// [EXPORT] //
	export default {
		props: {
			block: {
				type: Object,
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
				type: String,
				required: true
			},
		},

		components: {
			PageNavButtons
		},

		data: function() {
			return {
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page),
			}
		},

		methods: {
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
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