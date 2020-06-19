<template>
	<div class="container">
		<div class="row">
			<!-- Main Content -->
			<section class="col-12 mt-4">
				<div class="card card-body bg-dark">
					<h4 class="text-light mb-2">Your Profile</h4>

					<table class="w-100 table-sm table-dark">
						<tr>
							<td class="w-25">Name</td>
							<td>{{ first_name }} {{ last_name }}</td>
						</tr>
						<tr>
							<td>Username</td>
							<td>{{ username }}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{{ email }}</td>
						</tr>
					</table>
				</div>
			</section>
		</div>

		<button class="mt-3 btn btn-secondary">Edit Your Profile</button>
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
				userProfileData: {},
				user_id: '',
				email: '',
				username: '',
				first_name: '',
				last_name: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) {
				router.push({ name: 'Dashboard' })
			}

			// Retrieve User Data //
			try {
				this.userProfileData = await UserService.getUserProfileData()
			}
			catch(e) { this.error = e }

			this.user_id = this.userProfileData._id
			this.email = this.userProfileData.email
			this.username = this.userProfileData.username
			this.first_name = this.userProfileData.first_name
			this.last_name = this.userProfileData.last_name

			// [LOG] //
			this.log()
		},

		methods: {
			log() {
				console.log('%%% [PAGE] User Profile %%%')
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