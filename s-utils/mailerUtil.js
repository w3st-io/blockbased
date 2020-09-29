/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% MAILER UTIL %%%
 * %%%%%%%%%%%%%%%%%%%
 */
// [REQUIRE] //
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config') 


// [INIT] //
const service = config.EMAIL_SERVICE
const email = config.EMAIL
const emailPassword = config.EMAIL_PASSWORD
const baseURL = config.BASE_URL


// [DEFAULT] //
async function sendMail(to, subject, html) {
	try {
		// [VALIDATE] //
		if (!validator.isEmail(to) || !validator.isAscii(subject)) {
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
			subject: subject,
			html: html
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
}


// [VERIFICATION] //
async function sendVerificationMail(to, user_id, VCode) {
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
}


// [PASSWORD-RESET] //
async function sendPasswordResetEmail(to, user_id, VCode) {
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
}


// [EXPORT] //
module.exports = {
	sendMail,
	sendVerificationMail,
	sendPasswordResetEmail,
}