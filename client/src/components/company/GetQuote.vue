<template>
	<div>
		<!-- Get a Quote -->
		<form @submit.prevent="submit">
			<h3 class="mb-3 text-center text-primary">
				Get a Quote
			</h3>
			<hr>

			<!-- Type -->
			<select v-model="type" class="form-select w-100 p-2" placeholder="s">
				<option disabled value="">Please choose service type</option>
				<option value="designs">Designs</option>
				<option value="installs">Installs</option>
				<option value="services">Services</option>
			</select>

			<!-- Email -->
			<input v-model="email" type="email" placeholder="Email" class="mt-3 form-control">

			<!-- Name -->
			<input v-model="name" type="text" placeholder="Name" class="mt-3 form-control">

			<!-- Subject -->
			<input v-model="subject" type="text" placeholder="Subject" class="mt-3 form-control">

			<!-- Message -->
			<textarea
				v-model="message"
				type="text"
				placeholder="Message"
				class="mt-3 form-control"
			></textarea>

			<!-- Submit -->
			<BButton type="submit" class="w-100 mt-3">Submit</BButton>

			<h6 v-if="error" class="mt-2 text-danger">{{ error }}</h6>
		</form>
	</div>
</template>

<script>
	import router from '@/router'
	import MailService from '@/services/MailService'

	export default {
		data() {
			return {
				type: '',
				email: '',
				name: '',
				subject: '',
				message: '',
				error: '',
			}
		},

		methods: {
			async submit() {
				if (this.type == '') {
					this.error = 'Error: Please Select a service type'
					return
				}
					
				if (!this.type || !this.email || !this.name || !this.subject || !this.message) {
					this.error = 'Error: Please fill out all fields'
					return
				}

				const mObj = await MailService.s_getQuote(
					this.type,
					this.email,
					this.name,
					this.subject,
					this.message
				)

				if (mObj.status) { router.push({ name: 'email-sent' }) }
				else { this.error = mObj.message }
			}
		},
	}
</script>