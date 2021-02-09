// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const mailerUtil = require('../../s-utils/mailerUtil')
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MAIN-ROUTE] //
router.post(
	'/get-quote',
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.type) &&
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.name) &&
				validator.isAscii(req.body.subject) &&
				req.body.message
			) {
				if (
					req.body.type == 'designs' ||
					req.body.type == 'installs' ||
					req.body.type == 'services'
				) {
					// Determin toEmail //
					let toEmail = null
					if (req.body.type == 'designs') { toEmail = config.DESIGNS_EMAIL }
					if (req.body.type == 'installs') { toEmail = config.INSTALLS_EMAIL }
					if (req.body.type == 'services') { toEmail = config.SERVICES_EMAIL }
					
					// [INIT] //
					const subject = `Get Quote - Customer Subject: ${req.body.subject}`
					const html = `
						<h1>Customer Quote Request</h1>
						<h3 style="margin: 0;">Type: ${req.body.type}</h3>
						<h3 style="margin: 0;">Email: ${req.body.email}</h3>
						<h3 style="margin: 0;">Name: ${req.body.name}</h3>
						<h3 style="margin: 0;">Subject: ${req.body.subject}</h3>
						
						<h3 style="margin: 0; margin-top: 20px;">Message:</h3>
						<p>${req.body.message}</p>
					`


					// [MAIL-UTIL] //
					const mObj = await mailerUtil.sendMail(toEmail, subject, html)
			
					if (mObj.status) {
						res.status(200).send({
							executed: true,
							status: true,
							message: 'Email sent',
						})
					}
					else { res.status(200).send(mObj) }
				}
				else {
					res.status(200).send({
						executed: true,
						status: false,
						message: `/api/mail/get-quote: Invalid service type`
					})
				}
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: `/api/mail/get-quote: Invalid params`
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/admins/get-quote: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router