<template>
	<article>
		<h3 class="m-3 text-center text-light">Welcome Back</h3>
		<div class="m-auto p-4 card bg-dark border-secondary login-terminal">
			<!-- lOG IN FORM -->
			<ValidationObserver v-slot="{ handleSubmit }">
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
						class="btn btn-lg btn-primary btn-block"
						type="submit"
						:disabled="submitted"
					>Login</button>
				</form>
			</ValidationObserver>
		</div>

		<!-- [STATUS + ERROR] -->
		<div class="mx-auto my-3 login-terminal">
			<div v-if="error" class="alert alert-danger">
				<!-- Dont give them info on whats wrong HAHAHA -->
				{{ error = 'Incorrect Email or Password' }}
			</div>
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
				submitted: false,
				email: '',
				password: '',
				returned: '',
				error: '',
			}
		},

		created: function() {
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
						this.returned.data.token &&
						this.returned.data.status != 'incorrect_email' &&
						this.returned.data.status != 'incorrect_password'
					) { this.successful() }
					else { this.error = this.returned.data.status }
				}
				catch(err) { this.error = err }
			},

			successful() {
				// [SET TOKEN] // Emit // [REDIRECT] //
				localStorage.setItem('usertoken', this.returned.data.token)

				UserService.getUserTokenDecodeData()

				EventBus.$emit('logged-in')
				router.push({ path: '/' })
			},
		}
	}
</script>

<style scoped>
	.login-terminal { max-width: 350px; }
</style>
