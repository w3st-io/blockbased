// ORDER: to, subject, user_id, clientEmail, name, message, position, html, attachments
// [REQUIRE] //
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config') 


// [INIT] Const //
const service = config.EMAIL_SERVICE
const email = config.EMAIL
const emailPassword = config.EMAIL_PASSWORD
const baseURL = config.CLIENT_BASE_URL
const auth = {
	user: email,
	pass: emailPassword
}


module.exports = {
	// [GET-QUOTE] //
	sendGetQuoteEmail: async function ({ subject, clientEmail, name, message, attachments }) {
		try {
			// [VALIDATE] subject //
			if (!validator.isAscii(subject)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid subject',
				}
			}
	
			// [VALIDATE] clientEmail //
			if (!validator.isEmail(clientEmail)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: clientEmail not an email',
				}
			}
	
			// [VALIDATE] name //
			if (!validator.isAscii(name)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid name',
				}
			}
	
			// [VALIDATE] message //
			if (!validator.isAscii(message)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid message',
				}
			}
	
			// [VALIDATE] html xss //
			if (attachments) {
				if (!Array.isArray(attachments)) {
					return {
						executed: true,
						status: false,
						message: 'mailerUtil: Attachments must be an array',
					}
				}
			}
	
			// [INIT] //
			const to = config.ADMIN_EMAIL
			const subject2 = `Client Subject: ${subject}`
			const html = `
				<h1>Customer Quote Request</h1>
				<h3 style="margin: 0;">Type: ${type}</h3>
				<h3 style="margin: 0;">Email: ${clientEmail}</h3>
				<h3 style="margin: 0;">Name: ${name}</h3>
				<h3 style="margin: 0; margin-top: 20px;">Message:</h3>
				<p>${message}</p>
			`
	
			const transporter = nodemailer.createTransport({
				service: service,
				auth: auth
			})
	
			// [SEND-MAIL] //
			await transporter.sendMail({
				from: email,
				to: to,
				subject: subject2,
				html: html,
				attachments: attachments,
			})
	
			return {
				executed: true,
				status: true,
				send: true,
				message: 'Email Sent',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			}
		}
	},


	// [ADVANCED] //
	sendAdvancedEmail: async function ({ subject, clientEmail, name, message, position, attachments }) {
		try {
			// [VALIDATE] subject //
			if (!validator.isAscii(subject)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid subject',
				}
			}
	
			// [VALIDATE] clientEmail //
			if (!validator.isEmail(clientEmail)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: clientEmail not an email',
				}
			}
	
			// [VALIDATE] name //
			if (!validator.isAscii(name)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid name',
				}
			}
	
			// [VALIDATE] message //
			if (!validator.isAscii(message)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid message',
				}
			}
	
			// [VALIDATE] position //
			if (!validator.isAscii(position)) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid position',
				}
			}
	
			// [VALIDATE] html xss //
			if (attachments) {
				if (!Array.isArray(attachments)) {
					return {
						executed: true,
						status: false,
						message: 'mailerUtil: Attachments must be an array',
					}
				}
			}
	
			// [INIT] //
			const to = config.ADMIN_EMAIL
			const subject2 = `Client Subject: ${subject}`
			const html = `
				<h1>Customer Quote Request</h1>
				<h3 style="margin: 0;">Type: Careers</h3>
				<h3 style="margin: 0;">Email: ${clientEmail}</h3>
				<h3 style="margin: 0;">Name: ${name}</h3>
				<h3 style="margin: 0;">Position: ${position}</h3>
				<h3 style="margin: 0; margin-top: 20px;">Message:</h3>
				<p>${message}</p>
			`
	
			const transporter = nodemailer.createTransport({
				service: service,
				auth: auth
			})
	
			// [SEND-MAIL] //
			await transporter.sendMail({
				from: email,
				to: to,
				subject: subject2,
				html: html,
				attachments: attachments,
			})
	
			return {
				executed: true,
				status: true,
				send: true,
				message: 'Email Sent',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			}
		}
	},


	// [VERIFICATION] //
	sendVerificationMail: async function (to, user_id, VCode) {
		try {
			// [VALIDATE] //
			if (
				!validator.isEmail(to) ||
				!mongoose.isValidObjectId(user_id) ||
				!validator.isAscii(VCode)
			) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid params'
				}
			}
	
			const transporter = nodemailer.createTransport({
				service: service,
				auth: {
					user: email,
					pass: emailPassword
				}
			})
	
			const mailOptions = {
				from: email,
				to: to,
				subject: 'Verify Your BlockBased.io Account',
				html: `
					<h1>Thank you creating an account! Verify & Join us!<h1/>
					<a href="${baseURL}/user/verify/${user_id}/${VCode}">
						<button>Click to Verify</button>
					</a>
				`
			}
	
			// [SEND-MAIL] //
			const sentEmail = await transporter.sendMail(mailOptions)
	
			return {
				executed: true,
				status: true,
				message: 'Email Sent',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			}
		}
	},


	// [RESET-PASSWORD] //
	sendPasswordResetEmail: async function (to, user_id, VCode) {
		try {
			// [VALIDATE] //
			if (
				!validator.isEmail(to) ||
				!mongoose.isValidObjectId(user_id) ||
				!validator.isAscii(VCode)
			) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid params'
				}
			}

			const transporter = nodemailer.createTransport({
				service: service,
				auth: {
					user: email,
					pass: emailPassword
				}
			})

			const mailOptions = {
				from: email,
				to: to,
				subject: 'Reset Password For Your BlockBased.io Account',
				html: `
					<h1>Click the Link Below to Reset Your Password<h1/>
					<h4>If you did not request to change your password ignore this email</h4>
					<a href="${baseURL}/user/password/reset/${user_id}/${VCode}">
						<button>Click to Reset Password</button>
					</a>
				`
			}

			// [SEND-MAIL] //
			const sentEmail = await transporter.sendMail(mailOptions)

			return {
				executed: true,
				status: true,
				message: 'Email Sent',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			}
		}
	},
}