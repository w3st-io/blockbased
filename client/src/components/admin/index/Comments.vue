<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Post Id</th>
					<th>Comment</th>
					<th>Owner Email</th>
					<th>Owner Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="comment in comments" :key="comment._id">
					<td>{{ comment.post.title }}</td>
					<td>{{ comment.text }}</td>
					<td>{{ comment.user.email }}</td>
					<td>{{ comment.user.username }}</td>
					<td>{{ new Date(comment.createdAt).toLocaleString() }}</td>
					<td class="text-center">
						<button
							@click="deleteComment(comment._id)"
							class="btn btn-danger"
						>Delete</button>
					</td>
				</tr>
			</tbody>
		</table>

		<!-- [ALERTS] -->
		<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import ACommentService from '@services/administration/CommentService'

	// [EXPORT] //
	export default {
		props: {
			comments: { type: Array, required: true, },
		},

		data: function() {
			return {
				error: '',
			}
		},

		created: async function() {
			// [LOG] //
			//this.log()
		},

		methods: {
			async deleteComment(comment_id) {
				// Delete Comment //
				try { await ACommentService.s_delete(comment_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin CommentsTable %%%')
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>