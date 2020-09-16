<template>
	<section>
		<table class="table table-sm table-bordered table-striped table-dark">
			<thead>
				<tr>
					<th>Cat Id</th>
					<th>Title</th>
					<th>Owner Email</th>
					<th>Owner Username</th>
					<th>Created At</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="post in posts" :key="post._id">
					<td>{{ post.cat_id }}</td>
					<td>{{ post.title }}</td>
					<td>{{ post.user.email }}</td>
					<td>{{ post.user.username }}</td>
					<td>{{ post.createdAt }}</td>
					<td class="text-center">
						<button
							@click="deletePost(post._id)"
							class="btn btn-danger"
						>Delete</button>
					</td>
				</tr>
			</tbody>
		</table>
		
		<!-- [AELRTS] -->
		<div v-if="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import APostService from '@services/administration/PostService'

	// [EXPORT] //
	export default {
		props: {
			posts: { type: Array, required: true, },
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
			async deletePost(post_id) {
				// Delete Post //
				try { await APostService.s_delete(post_id) }
				catch (err) { this.error = err }
				
				this.$emit('refreshData')
			},

			log() {
				console.log('%%% [COMPONENT] Admin PostsTable %%%')
				console.log('posts:', this.posts)
				if (this.error) { console.error('error:', this.error) }
			},
		},
	}
</script>