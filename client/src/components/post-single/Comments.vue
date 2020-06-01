<template>
	<section>
		<div
			v-for="(comment, index) in post"
			:key="index"
			class="d-flex my-2 py-2 bg-dark border border-secondary rounded-sm"
		>
			<!-- Image Section -->
			<div class="float-left px-3 py-1 border-right border-secondary" style="width: 15%;">
				<img src="../../assets/images/placeholder.png" class="w-100 rounded-lg">
				<p class="text-center m-0">{{ comment.username }}</p>
			</div>

			<!-- Comment Section -->
			<div class="float-right p-2" style="width: 85%; flex-grow: 1;">
				<p class="m-0 text-light">{{ comment.text }}</p>
			</div>
		</div>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import { comments } from '../../../defaults/cats'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				comments: comments,
				post: []
			}
		},

		created: function() {
		}
	}
</script>

<style scoped>
</style>