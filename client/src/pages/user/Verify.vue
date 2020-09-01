<template>
	<section class="container">
		<div class="mt-5 mx-auto card card-body bg-dark" style="max-width: 500px;">
			<div v-if="!error">
				<h1 class="text-success text-center" style="font-size: 6em;">✓</h1>
				<h3 class="text-success text-center">Account Verified!</h3>
			</div>

			<div v-if="error">
				<h1 class="text-danger text-center" style="font-size: 6em;">𝘹</h1>
				<h3 class="text-danger text-center">Could not verify account</h3>

				<p class="mt-5 text-light">{{ error }}</p>
			</div>
		</div>
	</section>
</template>

<script>
	// [IMPORT] Personal //
	import UserService from '../../services/UserService'

	export default {
		data: function() {
			return {
				user_id: this.$route.params.user_id,
				verificationCode: this.$route.params.verification_code,
				data: {},
				error: '',
			}
		},

		created: async function() {
			try {
				this.data = await UserService.verify(
					this.user_id,
					this.verificationCode
				)

				console.log('sdf', this.data)
				console.log('ajsdfklajsdkl;fjaskl;dfj')
			}
			catch (err) { this.error = err }

			

			if (this.data.status && this.data.existance) { console.log('success') }
			else { this.error = this.data.message }
		},
	}
</script>