/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% MAILER UTIL %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const nodemailer = require('nodemailer')
require('dotenv').config()


// [DEFAULT] //
async function sendMail(to, subject, html) {
	const service = process.env.EMAIL_SERVICE || 'gmail'
	const email = process.env.EMAIL || ''
	const password = process.env.EMAIL_PASSWORD || ''

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
		subject: subject,
		html: html
	}

	// [SEND-MAIL] //
	try {
		const email = await transporter.sendMail(mailOptions)

		return {
			executed: true,
			status: true,
			message: 'Email Sent',
			email: email,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `mailerUtil: Error --> ${err}`,
		}
	}
}


// [VERIFICATION] //
async function sendVerificationMail(to, user_id, VCode) {
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
		subject: 'Verify Your BlockBased.io Account',
		html: `
			<h1>Thank you creating an account! Verify & Join us!<h1/>
			<a href="${base_url}/verify/${user_id}/${VCode}">
				<button>Click to Verify</button>
			</a>
		`
	}

	// [SEND-MAIL] //
	try {
		const email = await transporter.sendMail(mailOptions)

		return {
			executed: true,
			status: true,
			message: 'Email Sent',
			email: email,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `mailerUtil: Error --> ${err}`,
		}
	}
}


// [PASSWORD-RESET] //
async function sendPasswordResetEmail(to, user_id, code) {
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
			<a href="${base_url}/set-new-password/${user_id}/${code}">
				<button>Click to Reset Password</button>
			</a>
		`
	}

	// [SEND-MAIL] //
	try {
		const email = await transporter.sendMail(mailOptions)

		return {
			executed: true,
			status: true,
			message: 'Email Sent',
			email: email,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `mailerUtil: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	sendMail,
	sendVerificationMail,
	sendPasswordResetEmail,
}