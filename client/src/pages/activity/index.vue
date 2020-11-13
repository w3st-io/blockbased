<template>
	<article class="container">
		<div class="row mt-3">
			<div class="col-12">
				<div class="card card-body bg-dark text-light">
					<h4>All Activity</h4>
					<ul class="list-group">
						<li
							v-for="activity in data.activities"
							:key="activity._id"
							class="list-group-item bg-dark"
						>
							<div class="row">
								<!-- Created User -->
								<div v-if="activity.user" class="col-sm-6 text-success">
									<h5>
										<img
											:src="activity.user.profileImg"
											alt="x"
											class="mr-2"
											style="max-width: 34px;"
										>
										{{ activity.user.username }} joined the site!
									</h5>
								</div>

								<!-- Created Post -->
								<div v-if="activity.post" class="col-sm-6 text-primary">
									<h5>
										<img
											:src="activity.post.user.profileImg"
											alt="x"
											class="mr-2"
											style="max-width: 34px;"
										>
										{{ activity.post.user.username }}
										created post: 
										{{ activity.post.title }}
									</h5>
								</div>

								<!-- Created Comment -->
								<div v-if="activity.comment" class="col-sm-6">
									<h5>
										<img
											:src="activity.comment.user.profileImg"
											alt="x"
											class="mr-2"
											style="max-width: 34px;"
										>
										{{ activity.comment.user.username }}
										created a comment in
										{{ activity.comment.post.title }}
									</h5>
								</div>

								<!-- Timestamp -->
								<div class="col-sm-6 text-right text-secondary">
									{{ new Date(activity.createdAt).toLocaleString() }}
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</article>
</template>

<script>
	// [IMPORT] //
	import pageService from '../../services/PageService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				data: {},
			}
		},

		created: async function() {
			this.data = await pageService.s_activity()

			console.log(this.data)
		}
	}
</script>