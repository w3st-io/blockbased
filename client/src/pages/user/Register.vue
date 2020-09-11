<template>
	<article class="mx-auto my-3 text-light register-terminal">
		<!-- Title -->
		<h3 class="mb-3 text-center">Join Something Awesome!</h3>

		<div class="card card-body bg-dark border-secondary">
				<!-- FORM + VEE-VALIDATE -->
			<ValidationObserver v-slot="{ handleSubmit }">
				<form @submit.prevent="handleSubmit(register)">
					<!-- First Name -->
					<label for="first_name">First Name</label>
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
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
					<label for="last_name">Last Name</label>
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
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
					<label for="username">Username</label>
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required"
						v-slot="{ errors }"
					>
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
					<label for="email">Email Address</label>
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|email"
						v-slot="{ errors }"
					>
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
					<label for="password">Password</label>
					<ValidationProvider
						tag="div"
						class="form-group"
						rules="required|password:8, 50|confirmed:@confirmation"
						v-slot="{ errors }"
					>
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
					<label for="confirm">Confirm Password</label>
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
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>

					<!-- Submit -->
					<button type="submit" class="w-100 mt-5 btn btn-lg btn-primary">
						Register
					</button>
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
				catch (err) { this.error = err }
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>