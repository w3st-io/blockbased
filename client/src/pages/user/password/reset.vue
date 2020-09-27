<template>
	<div class="container text-white">
		<div class="row mt-3">
			<div class="col">
				<div class="m-auto w-100 card card-body bg-dark" style="max-width: 500px;">
					<h5 class="text-center">Create New Password</h5>
					<p>Please enter your new password</p>

					<!-- LOG IN FORM -->
					<ValidationObserver v-slot="{ handleSubmit }">
						<form @submit.prevent="handleSubmit(submit)">
							<!-- Password -->
							<ValidationProvider
								tag="div"
								class="form-group"
								rules="required|password:8, 50|confirmed:@confirmation"
								v-slot="{ errors }"
							>
								<input
									v-model="password"
									type="password"
									class="form-control bg-dark text-light border-secondary"
									:class="{ 'is-invalid border-danger': errors != '' }"
									placeholder="Password"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>

							<!-- Confirmed Password -->
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
									placeholder="Repeat Password"
								>
								<span class="text-danger">{{ errors[0] }}</span>
							</ValidationProvider>
					
							<!-- Submit -->
							<button
								class="btn btn-primary"
							>Send Password Reset Email</button>
						</form>
					</ValidationObserver>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			submit() {},
		},
	}
</script>