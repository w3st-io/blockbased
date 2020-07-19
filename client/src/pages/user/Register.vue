<template>
	<article>
		<h3 class="m-3 text-center text-light">Join Something Awesome!</h3>
		<div class="m-auto p-4 card bg-dark border-secondary register-terminal">
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
						<label for="first_name" class="text-light">First Name</label>
						<input
							v-model="first_name"
							name="first_name"
							type="text"
							class="form-control bg-dark border-secondary text-light"
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
						<label for="last_name" class="text-light">Last Name</label>
						<input
							v-model="last_name"
							name="last_name"
							type="text"
							class="form-control bg-dark border-secondary text-light"
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
						<label for="username" class="text-light">Username</label>
						<input
							v-model="username"
							name="username"
							type="text"
							class="form-control bg-dark border-secondary text-light"
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
						<label for="email" class="text-light">Email Address</label>
						<input
							name="email"
							type="email"
							class="form-control bg-dark border-secondary text-light"
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
						rules="required|password:6,23|confirmed:@confirmation"
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

					<!-- Confirmed Password -->
					<ValidationProvider
						tag="div"
						class="form-group" 
						name="confirmation"
						rules="required"
						v-slot="{ errors }"
					>
						<label for="confirm" class="text-light">Confirm Password</label>
						<input
							v-model="confirm"
							name="confirm"
							type="password"
							class="form-control bg-dark border-secondary text-light"
							:class="{ 'is-invalid border-danger': errors != '' }"
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>
					<br>

					<!-- Submit -->
					<button
						type="submit"
						class="btn btn-lg btn-primary btn-block"
					>Register</button>
				</form>
			</ValidationObserver>
		</div>

		<!-- [ERRORS] Email Taken, Username Taken, & Connection Failed -->
		<div class="mx-auto my-3 register-terminal">
			<div
				v-if="registerStatus === 'email_taken'"
				class="m-0 mt-3 alert alert-danger"
			>Email is taken. Try Another email.</div>
			<div
				v-if="registerStatus === 'username_taken'"
				class="m-0 mt-3 alert alert-danger"
			>Username is taken. Try Another username.</div>
			<div
				v-if="error !== ''"
				class="m-0 mt-3 alert alert-danger"
			>{{ error }}</div>
		</div>
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
				registerStatus: '',
				error: '',
			}
		},

		created: function() {
			// [REDIRECT] Log Required //
			if (localStorage.usertoken) { router.push({ name: 'Profile' }) }
		},

		methods: {
			async register() {
				try {
					let status = await UserService.register(
						this.first_name,
						this.last_name,
						this.username,
						this.email,
						this.password,
					)

					// Set "registerStatus" //
					this.registerStatus = status.data.status
				}
				catch(err) { this.error = err }
				
				// Check Status //
				if (this.registerStatus == 'success') {
					// [LOG] // Change Page //
					console.log('Account successfully created.')
					router.push({ name: 'Login' })
				}
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }
</style>