<template>
	<section class="w-100 mb-1 flex-container">
		<div class="w-50 float-left">
			<h3 class="w-auto text-light">
				{{ block.title }}
			</h3>

			<div class="py-2">
				<div class="w-50 btn-group flaot-right">
					<button class="w-25 btn btn-sm btn-outline-light">Prev</button>
					<button class="w-25 btn btn-sm btn-outline-light">Next</button>
				</div>
				<span class="mx-2 p-2 badge badge-light">
					{{ pageNumber }}
				</span>
			</div>
			
		</div>
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

		data: function() {
			return {
				pageNumber: (this.$route.params.page)
			}
		},

		methods: {
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			}
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