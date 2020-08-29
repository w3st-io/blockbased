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


function sendVerificationMail(to, VCode) {
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
		subject: 'Verify your BlockBased.io Account',
		html: `
			<h1>your verification Code is ${VCode}<h1/>
			<button>Click to Verify</button>
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