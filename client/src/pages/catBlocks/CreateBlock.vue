<template>
	<section class="container">
		<h3 class="my-3 text-light">Create Block in "{{ cat_id }}"</h3>
		<!-- [FORM] create Post -->
		<form class="mt-4 form-inline">
			<input
				id="create-post"
				type="text"
				class="w-75 form-control text-light bg-dark border-secondary"
				placeholder="Create a post.."
				aria-label="Recipient's username"
				v-model="title"
			>
			<div class="w-25 input-group-append">
				<button
					type="submit"
					class="w-100 ml-3 btn btn-outline-light"
					v-on:click="createBlock()"
				>+ Create</button>
			</div>
		</form>

		<hr>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	import BlockService from '../../services/BlockService'
	import router from '../../router'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				cat_id: this.$route.params.cat_id,
				title: '',
			}
		},

		methods: {
			// [CREATE] Create Post Via PostService Function //
			async createBlock() {
				await BlockService.createBlock(
					this.title,
					this.cat_id
				)

				router.push({ name: 'Cats', params: { cat_id: this.cat_id } })
			},
		}
	}
</script>