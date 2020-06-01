<template>
	<section>
		<div
			v-for="(comment, index) in page"
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
import { pages } from '../../../defaults/cats'
export default {
	data: function() {
		return {
			page: pages[0]
		}
	},

	created() {
		console.log(this.page)
	}
}
</script>

<style scoped>
</style>