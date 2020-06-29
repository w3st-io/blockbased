<template>
	<div class="container">
		<div v-if="loading" class="row my-3 alert alert-warning">
			Loading..
		</div>

		<div v-if="!loading" class="row">
			<div class="my-3 card card-body bg-dark">
				
				<label for="profilePicURL" class="text-light">Profile Pic Url</label>
				<input
					name="profilePicURL"
					type="text"
					class="my-2 form-control"
					v-model="imgUrl"
				>

				<div class="w-100 p-3 text-center">
					<img
						:src="imgUrl"
						alt="Profile Pic Here"
						class="border border-warning"
						style="width: 200px;"
					>
				</div>

				<button
					@click="updateUserProfileData()"
					class="w-100 btn btn-secondary"
				>Edit Your Profile</button>
			</div>
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
				loading: true,
				userTokenData: {},
				userProfileData: {},
				imgUrl: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) {
				router.push({ name: 'Dashboard' })
			}

			// Retrieve User Token Decode Data //
			try {
				this.decoded = await UserService.getUserTokenDecodeData()
			}
			catch(e) { this.error = e }

			// Retrieve User Profile Data //
			try {
				this.userProfileData = await UserService.getUserProfileData()
			}
			catch(e) { this.error = e }

			// Set Image //
			this.imgUrl = this.userProfileData.profilePicURL

			// Enable Loading //
			this.loading = false

			// [LOG] //
			this.log()
		},

		methods: {
			async updateUserProfileData() {
				try { await UserService.updateUserProfileData(this.imgUrl) }
				catch(e) { this.error = e }

				// [REDIRECT] //
				router.push({ path: '/profile' })
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('userTokenData:', this.userTokenData)
				console.log('userProfileData:', this.userProfileData)
				console.log('imgUrl:', this.imgUrl)
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