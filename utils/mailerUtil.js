// [REQUIRE] //
const nodemailer = require('nodemailer')
require('dotenv').config()


function sendMail(to, subject, html) {
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const email = process.env.EMAIL || ''
	const password = process.env.EMAIL_PASSWORD || ''


	// Step 1
	const transporter = nodemailer.createTransport({
		service: service,
		auth: { user: email, pass: password }
	})

	// Step 2
	const mailOptions = {
		from: email,
		to: to,
		subject: subject,
		html: html
	}

	// Step 3
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) return `Caught Error --> ${err}`
		return 'Email Sent'
	})
}


function sendVerificationMail(to, user_id, VCode) {
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const email = process.env.EMAIL || ''
	const password = process.env.EMAIL_PASSWORD || ''
	const url = process.env.URL || 'http://localhost:8080/#'


	// Step 1
	const transporter = nodemailer.createTransport({
		service: service,
		auth: { user: email, pass: password }
	})

	// Step 2
	const mailOptions = {
		from: email,
		to: 'aleem.ahmed1997@gmail.com',//to,
		subject: 'Verify your BlockBased.io Account',
		html: `
			<h1>Thank you creating an account! Verify & Join us!<h1/>
			<a href="${url}/verify/${user_id}/${VCode}">
				<button>Click to Verify</button>
			</a>
		`
	}

	// Step 3
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) return `Caught Error --> ${err}`
		return 'Email Sent'
	})
}


// [EXPORT] //
module.exports = {
	sendMail,
	sendVerificationMail,
}