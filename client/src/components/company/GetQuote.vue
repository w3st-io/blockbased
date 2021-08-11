<template>
	<div>
		<!-- Get a Quote -->
		<form @submit.prevent="submit">
			<h3 class="mb-3 text-center text-primary">{{ title }}</h3>
			<hr>

			<!-- Email -->
			<input
				v-model="clientEmail"
				type="email"
				placeholder="Your email"
				class="mt-3 form-control"
			>

			<!-- Name -->
			<input
				v-model="name"
				type="text"
				placeholder="Name"
				class="mt-3 form-control"
			>

			<!-- Subject -->
			<input
				v-model="subject"
				type="text"
				placeholder="Subject"
				class="mt-3 form-control"
			>

			<!-- Message -->
			<textarea
				v-model="message"
				type="text"
				placeholder="Message"
				class="mt-3 form-control"
			></textarea>

			<!-- Submit -->
			<BButton :disabled="loading" type="submit" class="w-100 mt-3">
				Submit
			</BButton>

			<h6 v-if="error" class="mt-2 text-danger">{{ error }}</h6>
		</form>
	</div>
</template>

<script>
	import router from '@/router'
	import MailService from '@/services/MailService'

	export default {
		props: {
			title: {
				type: String,
				default: 'Get a Quote',
			}
		},

		data() {
			return {
				clientEmail: '',
				name: '',
				subject: '',
				message: '',
				error: '',
				loading: false,
			}
		},

		methods: {
			async submit() {
				if (!this.clientEmail || !this.name || !this.subject || !this.message) {
					this.error = 'Error: Please fill out all fields'
					return
				}

				this.loading = true

				const mObj = await MailService.s_getQuote({
					subject: this.subject,
					clientEmail: this.clientEmail,
					name: this.name,
					message: this.message
				})

				if (mObj.status) { router.push({ name: 'email-sent' }) }
				else { this.error = mObj.message }

				this.loading = false
			}
		},
	}
</script>