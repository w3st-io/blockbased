<template>
	<article>
		<section class="mx-auto mt-5 p-4 card bg-dark border-secondary login-terminal">
			<section class="row">
				<!-- Welcome Half -->
				<section class="col-6">
					<h3 class="m-3 text-center text-light">Welcome Back</h3>
					<div class="text-center">
					<img :src="require('../../assets/images/logo.svg')" class="w-50">
					</div>
				</section>

				<!-- lOG IN FORM -->
				<ValidationObserver
					v-slot="{ handleSubmit }"
					tag="section"
					class="col-6"
				>
					<form @submit.prevent="handleSubmit(login)">
						<!-- Email -->
						<ValidationProvider
							tag="div"
							class="form-group"
							rules="required|email"
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

						<!-- FORM SUBMIT -->
						<button
							class="w-100 btn btn-lg btn-primary"
							type="submit"
							:disabled="submitted"
						>Login</button>
					</form>
				</ValidationObserver>
			</section>
		</section>

		<!-- [ALERTS] -->
		<div class="mx-auto my-3 login-terminal">
			<div v-if="error" class="alert alert-danger">{{ error }}</div>
		</div>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import { EventBus } from '@main'
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				email: '',
				password: '',
				returned: '',
				decoded: {},
				submitted: false,
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Not Logged Required //
			if (localStorage.usertoken) { router.push({ path: '/' }) }
		},

		methods: {
			async login() {
				try {
					// Get Status from Login Function //
					this.returned = await UserService.login(this.email, this.password)
					
					// Check Validation Status //
					if (
						this.returned.status == true &&
						this.returned.validation == true
					) { this.successful() }
					else { this.error = this.returned.message }
				}
				catch (e) { this.error = e }
			},

			async successful() {
				// [SET TOKEN] // Emit //
				localStorage.setItem('usertoken', this.returned.token)
				EventBus.$emit('logged-in')

				// [REDIRECT] //
				router.push({ path: '/' })
			},
		}
	}
</script>

<style scoped>
	.login-terminal { max-width: 800px; }
</style>
