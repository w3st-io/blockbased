<template>
	<div>
		<!-- Get a Quote -->
		<form @submit.prevent="submit">
			<h3 class="mb-3 text-center text-primary">{{ title }}</h3>
			<hr>

			<!-- Type -->
			<select v-model="type" class="form-select w-100 p-2">
				<option disabled value="">Please choose service type</option>
				<option value="designs">Designs</option>
				<option value="installs">Installs</option>
				<option value="report">Report Bug on Site</option>
				<option value="services">Services</option>
			</select>

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
				type: '',
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
				if (this.type == '') {
					this.error = 'Error: Please Select a service type'
					return
				}
					
				if (!this.type || !this.clientEmail || !this.name || !this.subject || !this.message) {
					this.error = 'Error: Please fill out all fields'
					return
				}

				this.loading = true

				const mObj = await MailService.s_getQuote({
					subject: this.subject,
					type: this.type,
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