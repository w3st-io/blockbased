/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% MAILER UTIL %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const nodemailer = require('nodemailer')
require('dotenv').config()


// [DEFAULT] //
function sendMail(to, subject, html) {
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const email = process.env.EMAIL || ''
	const password = process.env.EMAIL_PASSWORD || ''

	// Step 1
	const transporter = nodemailer.createTransport({
		service: service,
		auth: {
			user: email,
			pass: password
		}
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
		if (err) return `mailerUtils: Error --> ${err}`
		return 'Email Sent' + data
	})
}


// [VERIFICATION] //
function sendVerificationMail(to, user_id, VCode) {
	const email = process.env.EMAIL
	const password = process.env.EMAIL_PASSWORD
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const base_url = process.env.BASE_URL || 'http://localhost:8080'

	const transporter = nodemailer.createTransport({
		service: service,
		auth: {
			user: email,
			pass: password
		}
	})

	const mailOptions = {
		from: email,
		to: to,
		subject: 'Verify your BlockBased.io Account',
		html: `
			<h1>Thank you creating an account! Verify & Join us!<h1/>
			<a href="${base_url}/verify/${user_id}/${VCode}">
				<button>Click to Verify</button>
			</a>
		`
	}

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) return `Error --> ${err}`
		return 'Email Sent' + data
	})
}


// [PASSWORD-RESET] //
function sendPasswordResetEmail(to, user_id, token) {
	const email = process.env.EMAIL
	const password = process.env.EMAIL_PASSWORD
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const base_url = process.env.BASE_URL || 'http://localhost:8080'

	const transporter = nodemailer.createTransport({
		service: service,
		auth: {
			user: email,
			pass: password
		}
	})

	const mailOptions = {
		from: email,
		to: to,
		subject: 'Reset Password For Your BlockBased.io Account',
		html: `
			<h1>Thank you creating an account! Verify & Join us!<h1/>
			<a href="${base_url}/set-new-password/${user_id}/${VCode}">
				<button>Click to Reset Password</button>
			</a>
		`
	}

	transporter.sendMail(mailOptions, (err, data) => {
		if (err) return `Error --> ${err}`
		return 'Email Sent' + data
	})
}


// [EXPORT] //
module.exports = {
	sendMail,
	sendVerificationMail,
	sendPasswordResetEmail,
}