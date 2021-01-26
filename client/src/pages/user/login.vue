<template>
	<BContainer>
		<BCard bg-variant="dark" class="mx-auto mt-5" style="max-width: 800px;">
			<BRow>
				<!-- Welcome Half -->
				<BCol cols="12" md="6" class="d-none d-md-block">
					<h3 class="m-3 text-center text-light">Welcome Back</h3>
					<div class="text-center">
						<img :src="require('../../assets/images/logo.svg')" class="w-50">
					</div>
				</BCol>

				<BCol cols="12" md="6">
					<!-- LOG IN FORM -->
					<ValidationObserver v-slot="{ handleSubmit }" tag="section">
						<form @submit.prevent="handleSubmit(login)">
							<!-- Email  -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<label for="email" class="text-light">Email</label>
								<input
									v-model="email"
									name="email"
									type="email"
									class="form-control bg-dark border-secondary text-light"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="Example@example.com"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Password -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required"
								v-slot="{ errors }"
							>
								<label for="password" class="text-light">Password</label>
								<input
									v-model="password"
									name="password"
									type="password"
									class="form-control bg-dark border-secondary text-light"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="******"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>
							<br>

							<!-- Submit -->
							<BButton
								variant="primary"
								size="lg"
								:disabled="submitted"
								class="w-100 mb-1"
								type="submit"
							>Login</BButton>
						</form>
						<RouterLink to="/user/password/request" class="text-primary">
							Forgot password?
						</RouterLink>
					</ValidationObserver>
				</BCol>
			</BRow>
			
			<!-- [ERROR] -->
			<BRow class="mt-3">
				<BCol cols="12">
					<Alert
						v-if="error"
						variant="danger"
						:message="error"
						class="m-auto"
						style="max-width: 800px;"
					/>
				</BCol>
			</BRow>
		</BCard>
	</BContainer>
</template>

<script>
	// [IMPORT] Personal //
	import Alert from '@components/misc/Alert'
	import { EventBus } from '@main'
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		components: {
			Alert,
		},

		data: function() {
			return {
				submitted: false,
				email: '',
				password: '',
				reqData: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Logged //
			if (localStorage.usertoken) { router.push({ name: '/' }) }
		},

		methods: {
			async login() {
				try {
					// [VALIDATE] //
					if (!this.email || !this.password)  {
						this.error = 'Fields are required'
						return
					}

					// [LOGIN] //
					this.reqData = await UserService.s_login(
						this.email,
						this.password
					)
					
					// Check Validation Status //
					if (
						this.reqData.status == true &&
						this.reqData.validation == true
					) { this.successful() }
					else { this.error = this.reqData.message }
				}
				catch (err) { this.error = err }
			},

			async successful() {
				// [SET TOKEN] //
				localStorage.setItem('usertoken', this.reqData.token)

				// [EMIT] //
				EventBus.$emit('user-logged-in')

				// [REDIRECT] //
				router.go(-1)
			},
		}
	}
</script>