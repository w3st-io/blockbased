<template>
	<div class="my-4 container card card-body bg-dark">
		<div class="mt-3 row">
			<!-- Profile Details -->
			<div class="col-sm-12 col-md-8 mb-3">
				<div class="row">
					<div class="col-4">
						<img
							:src="profileImg"
							alt="Profile Image Not Available"
							class="w-100"
						>
						<h3 class="text-light">{{ username }}</h3>
					</div>

					<div class="col-8">
						<h5 class="text-light">Name: {{ first_name }} {{ last_name }}</h5>
						<h5 class="text-light">Email: {{ email }}</h5>
					</div>
				</div>
			</div>

			<!-- Score -->
			<div class="col-sm-12  col-md-4">
				<h1 class="h5 text-light"></h1>
			</div>
		</div>
	</div>
</template>

<script>
	import UserService from '../../services/UserService'

	export default {
		data: function() {
			return {
				user_id: this.$route.params.user_id,
				username: '',
				email: '',
				first_name: '',
				last_name: '',
				profileImg: require('../../assets/images/DefaultProfileImg.png'),
			}
		},

		created: async function() {
			let returnedData = await UserService.getUserProfileData(this.user_id)

			this.username = returnedData.username
			this.email = returnedData.email
			this.first_name = returnedData.first_name
			this.last_name = returnedData.last_name
			this.profileImg = returnedData.profileImg
		},
	}
</script>