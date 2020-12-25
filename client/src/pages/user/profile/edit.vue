<template>
	<div class="container">
		<div class="row my-3">
			<BCard bg-variant="dark" class="col-12">
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
				<Alert v-if="loading" variant="warning" message="Loading.." />
				<Alert v-if="error" variant="danger" :message="error" class="my-3" />
			</BCard>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@components/misc/Alert'
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
		},

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
			if (!localStorage.usertoken) { router.push({ name: '/' }) }

			// Retrieve User Profile Data //
			try { this.data = await UserService.s_read() }
			catch (err) { this.error = err }

			if (this.data.status) { this.userData = this.data.user }
			else { this.error = this.data.message }

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