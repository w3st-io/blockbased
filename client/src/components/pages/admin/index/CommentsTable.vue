<template>
	<table class="table table-sm table-bordered table-striped table-dark">
		<thead>
			<tr>
				<th>Block Id</th>
				<th>Comment</th>
				<th>Owner Email</th>
				<th>Owner Username</th>
				<th>Created At</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="comment in comments"
				:key="comment._id"
			>
				<td>{{ comment.block_id }}</td>
				<td>{{ comment.comment }}</td>
				<td>{{ comment.email }}</td>
				<td>{{ comment.username }}</td>
				<td>{{ comment.createdAt }}</td>
				<td class="text-center">
					<button
						@click="deleteComment(comment._id)"
						class="btn btn-danger"
					>Delete</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script>
	// [IMPORT] Personal //
	import ACommentService from '@services/administration/CommentService'

	export default {
		data: function() {
			return {
				comments: {},
				error: '',
			}
		},

		created: async function() {
			// Get Comments //
			await this.getComments()

			// [LOG] //
			this.log()
		},

		methods: {
			async deleteComment(comment_id) {
				// Delete Comment //
				try { await ACommentService.deleteComment(comment_id) }
				catch(e) { this.error = e }
				
				// Refresh Table //
				this.getComments()
			},

			async getComments() {
				// Get Comments //
				try {
					this.comments = await ACommentService.adminGetAllComments(100, 0)
				}
				catch(e) { this.error = e }
			},

			log() {
				console.log('%%% [COMPONENT] Admin CommentsTable %%%')
				console.log('comments:', this.comments)
				if (this.error) { console.log('error:', this.error) }
			},
		},
	}
</script>