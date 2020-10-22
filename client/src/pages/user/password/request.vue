<template>
	<div class="container text-white">
		<div class="row mt-3">
			<div class="col">
				<div class="m-auto w-100 card card-body bg-dark" style="max-width: 500px;">
					<h4 class="text-center">Enter Your Email to Reset Password</h4>

					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Email -->
							<ValidationProvider
								tag="div"
								type="email"
								class="my-3 form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<input
									v-model="email"
									name="email"
									type="email"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="example@example.com"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Submit -->
							<button type="submit" class="my-3 w-100 btn btn-primary">
								Send Email
							</button>
						</form>
					</ValidationObserver>
				</div>

				<!-- [ERROR] -->
				<div
					v-if="error"
					class="mx-auto my-3 alert alert-danger"
					style="max-width: 500px;"
				>{{ error }}</div>

				<!-- [SUCCESS] -->
				<div
					v-if="success"
					class="mx-auto my-3 alert alert-success"
					style="max-width: 500px;"
				>{{ success }}</div>
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
				email: '',
				data: '',
				success: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Required //
			if (localStorage.usertoken) { router.push({ name: 'profile' }) }
		},

		methods: {
			async submit() {
				try {
					this.data = await UserService.requestPasswordReset(this.email)

					if (!this.data.status || this.data.existance) {
						this.error = this.data.message
					}
					else {
						this.success = this.data.message

						setTimeout(() => { router.push({ name: 'login' }) }, 1500)
					}
				}
				catch (err) { this.error = err }
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>