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
							:class="{ 'is-invalid': errors!='' }"
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
							:class="{ 'is-invalid': errors!='' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>
					<br>

					<!-- FORM SUBMIT -->
					<button
						class="btn btn-lg btn-info btn-block"
						type="submit"
						:disabled="submitted"
					>Login</button>
				</form>
			</ValidationObserver>
		</div>

		<!-- [ERRORS] Incorrect Email/Password & Connection Failed -->
		<div class="mx-auto my-3 login-terminal">
			<div
				class="alert alert-danger"
				v-if="
					logInStatus === 'incorrect_email' ||
					logInStatus === 'incorrect_password'
				"
			>Incorrect password or email.</div>

			<div
				class="alert alert-danger"
				v-if="error != ''"
			>{{ error }}</div>
			</div>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import { EventBus } from '../../main'
	import router from '../../router'
	import UserService from '../../services/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				submitted: false,
				email: '',
				password: '',
				logInStatus: '',
				token: '',
				error: '',
			}
		},

		created: function() {
			// [REDIRECT] User Logged In Already //
			if (localStorage.usertoken) { router.push({ name: 'Profile' }) }
		},

		methods: {
			async login() {
				try {
					// Get Status from Login Function //
					let status = await UserService.login(this.email, this.password)

					// Check if Email or Username taken //
					if (status.data.status != 'incorrect_email') {
						if (status.data.status != 'incorrect_password') {
							this.token = status.data.token
							this.logInStatus = 'success'
						}
						// [INCORRECT PASSWORD] //
						else { this.logInStatus = status.data.status }
					}
					// [INCORRECT EMAIL]
					else { this.logInStatus = status.data.status }
				}
				catch(err) { this.error = err }

				// Check Status //
				if (this.logInStatus == 'success') {
					// [SET TOKEN] // Rest Form //
					localStorage.setItem('usertoken', this.token)
					this.email = ''
					this.password = ''

					// Emit // [REDIRECT] //
					EventBus.$emit('logged-in')
					router.push({ name: 'Profile' })
				}	
			},
		}
	}
</script>

<style scoped>
	.login-terminal {
		max-width: 350px;
	}
</style>
