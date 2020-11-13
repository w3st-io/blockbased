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
								<!-- Details Section -->
								<div class="col-sm-8">
									<!-- Created User -->
									<div v-if="activity.type == 'user'" class="row text-success">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.user.username }} joined the site!
										</h5>
									</div>

									<!-- Created Post -->
									<div v-if="activity.type == 'post'" class="row text-primary">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.post.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.post.user.username }}
											created post: 
											{{ activity.post.title }}
										</h5>
									</div>
									
									<!-- Created Comment -->
									<div v-if="activity.type == 'comment'" class="row">
										<div class="col m-0 p-0" style="max-width: 35px;">
											<img
												:src="activity.comment.user.profileImg"
												class="w-100"
											>
										</div>
										<h5 class="col">
											{{ activity.comment.user.username }}
											created a comment in
											{{ activity.comment.post.title }}
										</h5>
									</div>
								</div>

								<!-- Timestamp -->
								<div class="col-sm-4 text-right text-secondary">
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
	import pageService from '@services/PageService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				data: {},
				error: '',
			}
		},

		created: async function() {
			this.data = await pageService.s_activity()

			console.log(this.data)
		}
	}
</script>