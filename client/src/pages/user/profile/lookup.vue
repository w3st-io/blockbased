<template>
	<BContainer>
		<BRow class="mt-3">
			<BCol v-if="!error" sm="12" md="8">
				<BCard bg-variant="dark text-light">
					<!-- Profile Details -->
					<BRow>
						<BCol cols="4">
							<div class="border border-primary rounded">
								<img
									:src="user.profileImg"
									alt="Profile Image Not Available"
									class="w-100"
								>
							</div>
						</BCol>

						<BCol cols="8">
							<h3>{{ user.username }}</h3>
							<p>Joined {{ new Date(user.created_at).toLocaleString() }}</p>

							<BRow>
								<BCol cols="12" md="6">
									<BBadge variant="dark" class="w-100 py-2 border border-primary rounded">
										<h5>Total Comments</h5>
										<p>--</p>
									</BBadge>
								</BCol>
								<BCol cols="12" md="6">
									<BBadge variant="dark" class="w-100 py-2 border border-primary rounded">
										<h5>Total Posts</h5>
										<p>--</p>
									</BBadge>
								</BCol>
							</BRow>
						</BCol>
					</BRow>
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

			if (this.data.status) { this.user = this.data.user }
			else { this.error = this.data.message }
		},
	}
</script>