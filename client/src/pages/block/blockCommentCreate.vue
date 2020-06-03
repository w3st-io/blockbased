<template>
	<section class="container">
		<h3 class="my-3 text-light">Create Comment in "{{ block_id }}"</h3>
		
		<!-- [FORM] create Post -->
		<form class="mt-4 form-inline">
			<input
				id="create-post"
				type="text"
				class="w-75 form-control text-light bg-dark border-secondary"
				placeholder="Create a post.."
				aria-label="Recipient's username"
				v-model="textInput"
			>
			<div class="w-25 input-group-append">
				<button
					type="submit"
					class="w-100 ml-3 btn btn-outline-success"
					v-on:click="createComment()"
				>+ Create</button>
			</div>
		</form>

		<hr>
	</section>
</template>

<script>
	/*** [IMPORT] Personal ***/
	//import PostService from '../../services/PostService'

	/*** [EXPORT] ***/
	export default {
		data: function() {
			return {
				block_id: this.$route.params.block_id
			}
		},

		methods: {
			// [CREATE] Create Comment //
			async createComment() {
			},
		}
	}
</script>