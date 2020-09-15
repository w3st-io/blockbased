<template>
	<div class="container">
		<div class="row">
			<div class="my-3 card card-body bg-dark">
				<div v-if="!loading">
					<label for="profileImgInput" class="text-light">
						Profile Pic Url
					</label>

					<input
						name="profileImgInput"
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

					<button @click="updateUserData()" class="w-100 btn btn-secondary">
						Edit Your Profile
					</button>
				</div>

				<!-- [LOADING + ERROR] -->
				<div v-if="loading" class="alert alert-warning">Loading..</div>
				<div v-if="error" class="my-3 alert alert-danger">{{ error }}</div>
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
				userData: {},
				data: {},
				imgUrl: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (!localStorage.usertoken) { router.push({ name: 'forum' }) }

			// Retrieve User Profile Data //
			try {
				const returned = await UserService.s_read()

				if (returned.status) { this.userData = returned.user }
				else { this.error = returned.message }
			}
			catch (err) { this.error = err }

			// Set Image //
			this.imgUrl = this.userData.profileImg

			// Enable Loading //
			this.loading = false

			// [LOG] //
			//this.log()
		},

		methods: {
			async updateUserData() {
				try { this.data = await UserService.s_update(this.imgUrl) }
				catch (err) { this.error = err }

				if (this.data.status) {
					// [REDIRECT] //
					router.push({ name: 'profile' })
				}
				else { this.error = this.data.message }
			},

			log() {
				console.log('%%% [PAGE] User Profile %%%')
				console.log('userData:', this.userData)
				console.log('imgUrl:', this.imgUrl)
			},
		},
	}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 768px) {
		.hidden-768 {
			display: none !important;
		}
	}
</style>