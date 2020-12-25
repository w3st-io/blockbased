<template>
	<BContainer class="text-white">
		<BRow class="mt-3">
			<BCol cols="12">
				<BCard
					bg-variant="dark"
					border-variant="secondary"
					class="m-auto w-100"
					style="max-width: 500px;"
				>
					<h5 class="text-center">Create New Password</h5>
					<p>Please enter your new password</p>

					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Password -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required|password:8, 50|confirmed:@confirmation"
								v-slot="{ errors }"
							>
								<input
									v-model="password"
									type="password"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="Password"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Confirmed Password -->
							<ValidationProvider
								tag="div"
								name="confirmation"
								rules="required"
								class="form-group" 
								v-slot="{ errors }"
							>
								<input
									v-model="confirm"
									name="confirm"
									type="password"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="Repeat Password"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>
					
							<!-- Submit -->
							<BButton variant="primary" class="w-100">
								Reset Password
							</BButton>
						</form>
					</ValidationObserver>
				</BCard>

				<!-- [MESSAGE] -->
				<Alert
					v-if="message"
					variant="info"
					:message="message"
					class="mx-auto"
					style="max-width: 500px;"
				/>
			</BCol>
		</BRow>
	</BContainer>
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
				password: '',
				confirm: '',
				data: '',
				message: '',
			} 
		},

		methods: {
			async submit() {
				this.data = await UserService.resetPassword(
					this.$route.params.user_id,
					this.$route.params.verification_code,
					this.password
				)

				this.message = this.data.message

				setTimeout(() => { router.push({ name: 'login' }) }, 1500)
			},
		},
	}
</script>