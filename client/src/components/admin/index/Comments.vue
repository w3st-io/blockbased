<template>
	<section>
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
					<td>{{ comment.text }}</td>
					<td>{{ comment.user.email }}</td>
					<td>{{ comment.user.username }}</td>
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

		<!-- [ERROR] -->
		<div v-if="error" class="alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import ACommentService from '@services/administration/CommentService'

	// [EXPORT] //
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
					this.comments = await ACommentService.readAllAll(100, 0)
				}
				catch(e) { this.error = e }
			},

			log() {
				console.log('%%% [COMPONENT] Admin CommentsTable %%%')
				console.log('comments:', this.comments)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>