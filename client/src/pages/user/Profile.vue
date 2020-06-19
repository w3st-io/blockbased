<template>
	<div class="container">
		<div class="row">
			<!-- Side Content -->
			<section class="col-12 col-md-3 mt-4 hidden-768">
				<div class="card card-body bg-dark">
					<img
						:src="userProfileData.profilePicURL"
						alt="Profile Image Here"
						class="w-100"
					>
				</div>
			</section>

			<!-- Main Content -->
			<section class="col-12 col-md-9 mt-4">
				<div class="card card-body bg-dark">
					<h4 class="text-light mb-2">Your Profile</h4>

					<table class="w-100 table-sm table-dark">
						<tr>
							<td class="w-25">Name</td>
							<td>{{ userTokenData.first_name }} {{ userTokenData.last_name }}</td>
						</tr>
						<tr>
							<td>Username</td>
							<td>{{ userTokenData.username }}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{{ userTokenData.email }}</td>
						</tr>
					</table>

					<button
						@click="redirectProfileEdit()"
						class="w-100 mt-3 btn btn-secondary"
					>Edit Your Profile</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				userTokenData: {},
				userProfileData: {},
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) {
				router.push({ name: 'Dashboard' })
			}

			// Retrieve User Token Decode Data //
			try {
				this.userTokenData = await UserService.getUserTokenDecodeData()
			}
			catch(e) { this.error = e }

			// Retrieve User Profile Data //
			try {
				this.userProfileData = await UserService.getUserProfileData(this.userTokenData._id)
			}
			catch(e) { this.error = e }

			// [LOG] //
			this.log()
		},

		methods: {
			redirectProfileEdit() {
				router.push({ path: '/profile/edit' })
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('userTokenData:', this.userTokenData)
				console.log('userProfileData:', this.userProfileData)
			},
		},
	}
</script>

<style lang="scss" scoped>
	td { color: white; }

	@media screen and (max-width: 768px) {
		.hidden-768 {
			display: none !important;
		}
	}
</style>