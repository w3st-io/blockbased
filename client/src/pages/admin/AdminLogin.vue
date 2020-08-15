<template>
	<div class="mx-auto my-3 text-light login-terminal">
		<!-- Title -->
		<h3 class="mb-3 text-center">Admin Login</h3>

		<div class="card card-body bg-dark border-danger">
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
							class="form-control bg-dark text-light border-secondary"
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
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid': errors!='' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- FORM SUBMIT -->
					<button
						class="mt-5 btn btn-lg btn-primary border-danger btn-block"
						type="submit"
						:disabled="submitted"
					>Login</button>
				</form>
			</ValidationObserver>
		</div>

		<!-- [ALERTS] -->
		<div v-if="error" class="w-100 m-0 mt-3 alert alert-danger">
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
				returnedData: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] User Logged In Already //
			if (localStorage.admintoken) { router.push({ name: 'AdminProfile' }) }
		},

		methods: {
			async login() {
				// Get Status from Login Function //
				try {
					this.returnedData = await AdminService.login(
						this.email,
						this.password
					)

					// Check Validation Status //
					if (
						this.returnedData.status == true &&
						this.returnedData.validation == true
					) { this.successful() }
					else { this.error = this.returnedData.message }
				}
				catch(e) { this.error = e }
			},

			successful() {
				// [SET TOKEN] // Emit // [REDIRECT] //
				localStorage.setItem('admintoken', this.returnedData.token)
				EventBus.$emit('admin-logged-in')
				router.push({ name: 'AdminDashboard' })
			}
		}
	}
</script>

<style scoped>
	.login-terminal { max-width: 350px; }
</style>
