<template>
	<section class="w-100 mb-1 flex-container">
		<div class="w-50 float-left">
			<p class="mb-3 text-secondary small">{{ block.createdAt }}</p>
			<h2 class="w-auto text-light">
				<span class="bg-secondary mark">{{ block.title }}</span></h2>
		</div>
		<div class="w-50 float-right text-right">
			<button
				@click="redirectToBlockCommentCreate(block_id)"
				class="btn btn-info"
			>Add Comment</button>
		</div>
		<br>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		props: {
			block: {
				type: Object,
				required: true,
			}
		},

		methods: {
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			}
		}
	}
</script>

<style scoped>
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		flex-direction: unset;
	}
</style>