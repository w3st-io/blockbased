<template>
	<BRow class="mt-3">
		<!-- Account Details -->
		<BCol sm="12" md="9" class="mb-3">
			<BCard bg-variant="dark text-light">
				<!-- Profile Details -->
				<BRow>
					<!-- Profile -->
					<BCol cols="12" lg="3" class="mt-2">
						<BBadge variant="primary" class="w-100 mb-3 p-0 rounded">
							<h3 class="mb-1">{{ username }}</h3>
						</BBadge>

						<div class="m-auto" style="max-width: 170px;">
							<img
								:src="profileImg"
								alt="Profile Image Not Available"
								class="w-100 mx-auto border border-primary rounded"
							>
						</div>

						<h6 v-if="personal" class="mt-3">
							<span class="text-secondary">Email:</span>
							<br>
							{{ email }}
						</h6>

						<h6>
							<span class="text-secondary">Bio:</span>
							<br>
							{{ bio }}
						</h6>					

						<h6 class="mt-3">
							<span class="text-secondary">Joined:</span>
							<br>
							{{ new Date(created_at).toLocaleString() }}
						</h6>
					</BCol>

					<!-- Account Details -->
					<BCol cols="12" lg="9" class="mt-2">
						<BRow>
							<!-- Total Comments -->
							<BCol cols="12" sm="6" md="6" lg="3">
								<BBadge
									variant="dark"
									class="w-100 mb-2"
								>
									<h6>Total Comments</h6>
									<h4>{{ commentCount }}</h4>
								</BBadge>
							</BCol>

							<!-- Total Posts -->
							<BCol cols="12" sm="6" md="6" lg="3">
								<BBadge
									variant="dark"
									class="w-100 mb-2"
								>
									<h6>Total Posts</h6>
									<h4>{{ postCount }}</h4>
								</BBadge>
							</BCol>

							<!-- Post Score -->
							<BCol cols="12" sm="6" md="6" lg="3">
								<BBadge
									variant="dark"
									class="w-100 mb-2"
								>
									<h6>Post Score</h6>
									<h4>{{ postLikeCount }}</h4>
								</BBadge>
							</BCol>

							<!-- Comment Score -->
							<BCol cols="12" sm="6" md="6" lg="3">
								<BBadge
									variant="dark"
									class="w-100 mb-2"
								>
									<h6>Comment Score</h6>
									<h4>{{ commentLikeCount }}</h4>
								</BBadge>
							</BCol>
						</BRow>

						<hr class="border-primary">
						<BRow>
							<BCol cols="12">
								<h3>Awards</h3>
								<h6 class="py-5 text-center text-secondary">
									No awards yet
								</h6>
							</BCol>
						</BRow>

						<hr class="mt-4 border-secondary">
						<BRow>
							<BCol cols="6">
								<BButton
									v-if="personal"
									variant="outline-secondary"
									class="w-100 mt-3"
									@click="redirectProfileEdit()"
								>Edit Profile</BButton>
							</BCol>

							<BCol cols="6">
								<BButton
									v-if="personal"
									variant="outline-primary"
									class="w-100 mt-3"
									@click="redirectYourActivity()"
								>View Your Activity</BButton>
							</BCol>

							<BCol cols="12">
								<BButton
									v-if="!personal"
									variant="outline-primary"
									class="w-100 mt-3"
									@click="redirectActivity(user_id)"
								>View Activity</BButton>
							</BCol>
						</BRow>
					</BCol>
				</BRow>
			</BCard>
		</BCol>

		<!-- Social -->
		<BCol sm="12" md="3">
			<BCard bg-variant="dark text-light">
				<BBadge
					variant="dark"
					class="w-100 py-1 rounded"
				>
					<h6>Total Friends</h6>
					<h4>--</h4>
				</BBadge>
				
				<BButton v-if="!personal" variant="outline-success" class="w-100 mt-2">
					Add Friend
				</BButton>

				<BButton variant="outline-secondary" class="w-100 mt-2">
					View Friends
				</BButton>

				<BButton v-if="!personal" variant="outline-info" class="w-100 mt-2">
					Message
				</BButton>
			</BCard>
		</BCol>

		<!-- user_id -->
		<BCol cols="12" class="text-center">
			<span class="small text-secondary">{{ user_id }}</span>
		</BCol>
	</BRow>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'

	export default {
		props: {
			personal: {
				type: Boolean,
				default: false,
			},

			user_id: {
				type: String,
			},

			email: {
				type: String,
			},

			username: {
				type: String,
				required: true,
			},

			profileImg: {
				type: String,
				required: true,
			},

			bio: {
				type: String,
				required: true,
			},

			created_at: {
				type: String,
				required: true,
			},

			commentCount: {
				type: Number,
				required: true,
				default: 0,
			},

			commentLikeCount: {
				type: Number,
				required: true,
				default: 0,
			},

			postCount: {
				type: Number,
				required: true,
				default: 0,
			},

			postLikeCount: {
				type: Number,
				required: true,
				default: 0,
			},
		},

		methods: {
			redirectProfileEdit() {
				router.push({ name: 'edit' })
			},

			redirectActivity(user_id) {
				router.push({
					name: 'user_activity_lookup',
					params: {
						user_id: user_id,
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
			},

			redirectYourActivity() {
				router.push({
					name: 'user_activity',
					params: {
						sort: 1,
						limit: 5,
						page: 1,
					}
				})
			},
		},
	}
</script>