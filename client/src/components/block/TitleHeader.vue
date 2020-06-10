<template>
	<section class="w-100 mb-1 flex-container">
		<!-- Left Side -->
		<div class="w-50 float-left">
			<h3 class="w-auto text-light">
				{{ block.title }}
			</h3>

			<div class="py-2">
				<div class="w-50 btn-group flaot-right">
					<button
						@click="prevPage()"
						class="w-25 btn btn-sm btn-outline-light"
					>Prev</button>
					<button
						@click="nextPage()"
						class="w-25 btn btn-sm btn-outline-light"
					>Next</button>
				</div>
				<span class="mx-2 p-2 badge badge-light">
					{{ pageNumber }}
				</span>
			</div>
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
	/*** [IMPORT] Personal ***/
	import router from '../../router'
	import { EventBus } from '../../main'

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
				block_id: this.$route.params.block_id,
				pageNumber: (this.$route.params.page),
			}
		},

		methods: {
			redirectToBlockCommentCreate(block_id) {
				router.push({ path: `/block-comment-create/${block_id}` })
			},

			prevPage() {
				// As long as the page is not going into 0 or negative
				if (this.pageNumber != 1) {
					this.pageNumber--
					router.push({ path: `/block/${this.block_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
			},

			nextPage() {
				// As long as page does not exceed max Number of Pages
				if (this.pageNumber == this.pageNumber) {
					this.pageNumber++
					router.push({ path: `/block/${this.block_id}/${this.pageNumber}` })
					EventBus.$emit('force-rerender')
				}
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