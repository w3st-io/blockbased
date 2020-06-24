<template>
	<div class="login-terminal">
		<h3 class="mb-3 text-center">Admin Login</h3>
		<div class="p-4 card bg-dark border-danger">
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
						<label for="email">Email</label>
						<input
							v-model="email"
							name="email"
							type="email"
							class="form-control bg-dark text-white border-secondary"
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
						<label for="password">Password</label>
						<input
							v-model="password"
							name="password"
							type="password"
							class="form-control bg-dark text-white border-secondary"
							:class="{ 'is-invalid': errors!='' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>
					<br>

					<!-- FORM SUBMIT -->
					<button
						class="btn btn-lg btn-info border-danger btn-block"
						type="submit"
						:disabled="submitted"
					>Login</button>
				</form>
			</ValidationObserver>
		</div>
		<br>

		<!-- [ERRORS] -->
		<div v-if="error" class="alert alert-danger">
			{{ error }}
		</div>
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import AdminService from '@services/AdminService'
	import { EventBus } from '@main'

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
			// [REDIRECT] User Logged In Already //
			if (localStorage.admintoken) { router.push({ name: 'AdminProfile' }) }
		},

		methods: {
			async login() {
				// Get Status from Login Function //
				this.returned = await AdminService.login(this.email, this.password)

				// Check Validation Status //
				if (
					this.returned.data.token &&
					this.returned.data.status != 'incorrect_email' &&
					this.returned.data.status != 'incorrect_password'
				) { this.successful() }
            else { this.error = this.returned.data.status }
			},

			successful() {
				// [STORE TOKEN] //
				localStorage.setItem('admintoken', this.returned.data.token)

				// [EMIT -->] //
				EventBus.$emit('admin-logged-in')
				router.push({ name: 'AdminDashboard' })
			}
		}
	}
</script>

<style scoped>
	.login-terminal {
		max-width: 350px;
		margin: 50px auto;
	}

	.login-terminal label,
	.login-terminal h3 {
		color: white;
	}
</style>
