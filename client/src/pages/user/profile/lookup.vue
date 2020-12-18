<template>
	<BCard bg-variant="dark" class="container my-4">
		<div class="row mt-3">
			<div v-if="!error" class="col-sm-12 col-md-8 mb-3">
				<!-- Profile Details -->
				<div class="row">
					<div class="col-4">
						<img
							:src="user.profileImg"
							alt="Profile Image Not Available"
							class="w-100"
						>
					</div>

					<div class="col-8">
						<h3 class="text-light">{{ user.username }}</h3>
						<h5 class="text-light">Email: {{ user.email }}</h5>
					</div>
				</div>
			</div>

			<div v-if="error" class="col-12 alert alert-danger">{{ error }}</div>
		</div>
	</BCard>
</template>

<script>
	import PageService from '@services/PageService'

	export default {
		data: function() {
			return {
				user_id: this.$route.params.user_id,
				user: {},
				profileImg: require('../../../assets/images/DefaultProfileImg.png'),
				error: '',
			}
		},

		created: async function() {
			const returned = await PageService.s_user_profile_lookup(this.user_id)

			if (returned.status) { this.user = returned.user }
			else { this.error = returned.message }
		},
	}
</script>