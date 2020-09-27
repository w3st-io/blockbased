<template>
	<div class="container text-white">
		<div class="row mt-3">
			<div class="col">
				<div class="m-auto w-100 card card-body bg-dark" style="max-width: 500px;">
					<h5 class="text-center">Reset Password</h5>
					<p>Enter your email</p>

					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(register)">
							<!-- Email -->
							<ValidationProvider
								tag="div"
								type="email"
								class="mb-3 form-group"
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
							<button type="submit" class="w-100 btn btn-lg btn-primary">
								Register
							</button>
						</form>
					</ValidationObserver>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				email: '',
				data: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Required //
			if (localStorage.usertoken) { router.push({ name: 'profile' }) }
		},

		methods: {
			async submit() {
				
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>