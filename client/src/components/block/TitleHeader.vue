<template>
	<section class="mb-3 flex-container w-100">
		<div class="w-50 float-left">
			<h2 class="text-light">{{ block_id }}</h2>
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
			block_id: {
				type: String,
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