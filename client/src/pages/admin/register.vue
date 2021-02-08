<template>
	<div class="mx-auto my-3 text-light register-terminal">
		<!-- Title -->
		<h3 class="mb-3 text-center">Admin Register</h3>

		<BCard bg-variant="dark" border-variant="warning">
			<!-- FORM + VEE-VALIDATE -->
			<ValidationObserver v-slot="{ handleSubmit }">
				<form @submit.prevent="handleSubmit(register)">
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
							class="form-control bg-dark text-white border-secondary"
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
							class="form-control bg-dark text-white border-secondary"
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
						<label for="password">Password</label>
						<input
							v-model="password"
							name="password"
							type="password"
							class="form-control bg-dark text-light border-secondary"
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
							placeholder="******"
						>
						<span class="text-danger">{{ errors[0] }}</span>
					</ValidationProvider>
					<br>

					<!-- Submit -->
					<button
						type="submit"
						class="w-100 btn btn-lg btn-primary"
					>Register</button>
				</form>
			</ValidationObserver>
		</BCard>

		<!-- [ALERTS] -->
		<Alert v-if="error" variant="danger" :message="error" class="mt-3" />
	</div>
</template>

<script>
	// [IMPORT] Personal //
	import router from '@/router'
	import AdminService from '@/services/AdminService'
	import Alert from '@/components/inform/Alert'

	// [EXPORT] //
	export default {
		data() {
			return {
				username: '',
				email: '',
				password: '',
				confirm: '',
				data: '',
				error: '',
			}
		},

		components: {
			Alert
		},

		created: async function() {
			// [REDIRECT] Not Log Required //
			if (localStorage.admintoken) { router.push({ name: 'admin_profile' }) }
		},

		methods: {
			async register() {
				// [REGISTER] //
				try {
					this.data = await AdminService.s_register(
						this.username,
						this.email,
						this.password,
					)

					// Check Status //
					if (this.data.created) { this.redirect() }
					else { this.error = this.data.message }
				}
				catch (err) { this.error = err }
			},

			redirect() { router.push({ name: 'admin_login' }) },

			log() {
				console.log('%%% [PAGE] Admin Register %%%')
			},
		}
	}
</script>

<style scoped>
	.register-terminal { max-width: 350px; }


</style>