<template>
	<BContainer>
		<BRow class="mt-3">
			<BCol v-if="!error" sm="12" md="9" class="mb-3">
				<BCard bg-variant="dark text-light">
					<!-- Profile Details -->
					<BRow class="">
						<BCol cols="3">
							<h3 class="text-center">{{ user.username }}</h3>
							<div class="border border-primary rounded">
								<img
									:src="user.profileImg"
									alt="Profile Image Not Available"
									class="w-100 rounded"
								>
							</div>

							<h6 class="mt-2">
								Joined {{ new Date(user.created_at).toLocaleString() }}
							</h6>
						</BCol>

						<BCol cols="9">
							<BRow class="">
								<BCol cols="12" md="4">
									<BBadge
										variant="dark"
										class="w-100 mb-2 py-1 border border-secondary rounded"
									>
										<h6>Content Score</h6>
										<h4>--</h4>
									</BBadge>
								</BCol>
								<BCol cols="12" md="4">
									<BBadge
										variant="dark"
										class="w-100 mb-2 py-1 border border-secondary rounded"
									>
										<h6>Total Comments</h6>
										<h4>{{ data.commentCount }}</h4>
									</BBadge>
								</BCol>
								<BCol cols="12" md="4">
									<BBadge
										variant="dark"
										class="w-100 mb-2 py-1 border border-secondary rounded"
									>
										<h6>Total Posts</h6>
										<h4>{{ data.postCount }}</h4>
									</BBadge>
								</BCol>
							</BRow>

							<BRow class="mt-3">
								<BCol cols="12">
									Recent Activity
								</BCol>
							</BRow>
						</BCol>
					</BRow>
				</BCard>
			</BCol>
			<BCol v-if="!error" sm="12" md="3">
				<BCard bg-variant="dark text-light">
					<BBadge
						variant="dark"
						class="w-100 py-1 rounded"
					>
						<h6>Total Friends</h6>
						<h4>--</h4>
					</BBadge>

					<BButton variant="outline-success" class="w-100 mt-2">
						Add Friend
					</BButton>

					<BButton variant="outline-secondary" class="w-100 mt-2">
						View Friends
					</BButton>
				</BCard>
			</BCol>
			<BCol cols="12">
				<div v-if="error" class="col-12 alert alert-danger">{{ error }}</div>
			</BCol>
		</BRow>
	</BContainer>
</template>

<script>
	import PageService from '@services/PageService'

	export default {
		data: function() {
			return {
				user_id: this.$route.params.user_id,
				user: {},
				profileImg: require('../../../assets/images/DefaultProfileImg.png'),
				data: {},
				error: '',
			}
		},

		created: async function() {
			this.data = await PageService.s_user_profile_lookup(this.user_id)

			console.log(this.data)

			if (this.data.status) { this.user = this.data.user }
			else { this.error = this.data.message }
		},
	}
</script>