<template>
	<article class="mx-auto my-3 text-light register-terminal">
		<!-- Title -->
		<h3 class="mb-3 text-center">Join Something Awesome!</h3>

		<div class="card card-body bg-dark border-secondary">
				<!-- FORM + VEE-VALIDATE -->
			<ValidationObserver v-slot="{ handleSubmit }">
				<form @submit.prevent="handleSubmit(register)">
					<!-- First Name -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="first_name">First Name</label>
						<input
							v-model="first_name"
							name="first_name"
							type="text"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="John"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Last Name -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="last_name">Last Name</label>
						<input
							v-model="last_name"
							name="last_name"
							type="text"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="Doe"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Username -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="username">Username</label>
						<input
							v-model="username"
							name="username"
							type="text"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="username"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Email -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|email"
						v-slot="{ errors }"
					>
						<label for="email">Email Address</label>
						<input
							name="email"
							type="email"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="Example@example.com"
							v-model="email"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Password -->
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|password:8, 50|confirmed:@confirmation"
						v-slot="{ errors }"
					>
						<label for="password">Password</label>
						<input
							v-model="password"
							name="password"
							type="password"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Confirmed Password -->
					<ValidationProvider
						tag="div"
						class="form-group" 
						name="confirmation"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="confirm">Confirm Password</label>
						<input
							v-model="confirm"
							name="confirm"
							type="password"
							class="form-control bg-dark text-light border-secondary"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Submit -->
					<button
						type="submit"
						class="w-100 mt-5 btn btn-lg btn-primary"
					>Register</button>
				</form>
			</ValidationObserver>
		</div>
		
		<!-- [ALERTS] -->
		<div v-show="error" class="m-0 mt-3 alert alert-danger">{{ error }}</div>
	</article>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@router'
	import UserService from '@services/UserService'

	// [EXPORT] //
	export default {
		data: function() {
			return {
				first_name: '',
				last_name: '',
				username: '',
				email: '',
				password: '',
				data: '',
				error: '',
			}
		},

		created: async function() {
			// [REDIRECT] Log Required //
			if (localStorage.usertoken) { router.push({ name: 'Profile' }) }
		},

		methods: {
			async register() {
				try {
					this.data = await UserService.register(
						this.first_name,
						this.last_name,
						this.username,
						this.email,
						this.password,
					)

					// Check Status //
					if (this.data.created) { router.push({ name: 'Login' }) }
					else { this.error = this.data.message }
				}
				catch (e) { this.error = e }
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>