// ORDER: to, subject, type, user_id, clientEmail, name, message, position, html, attachments
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const fs = require('fs')
const multer = require('multer')
const validator = require('validator')


// [REQUIRE] Personal //
const mailerUtil = require('../../s-utils/mailerUtil')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [MULTER] //
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, callBack) { callBack(null, './s-uploads') },
	
		filename: function (req, file, callBack) {
			callBack(null, `${new Date().toISOString()}-${file.originalname}`)
		}
	})
})


// [MAIN-ROUTE] //
router.post(
	'/get-quote',
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.subject) &&
				validator.isAscii(req.body.type) &&
				(
					req.body.type == 'designs' ||
					req.body.type == 'installs' ||
					req.body.type == 'report' ||
					req.body.type == 'services'
				) &&
				validator.isAscii(req.body.clientEmail) &&
				validator.isAscii(req.body.name) &&
				req.body.message
			) {
				// [MAIL-UTIL] //
				const mObj = await mailerUtil.sendGetQuoteEmail({
					subject: req.body.subject,
					type: req.body.type,
					clientEmail: req.body.clientEmail,
					name: req.body.name,
					message: req.body.message,
				})
		
				if (mObj.status) {
					res.send({
						executed: true,
						status: true,
						message: 'Email sent',
					})
				}
				else { res.send(mObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/mail/get-quote',
					message: 'Invalid params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/mail/get-quote',
				message: `Caught Error --> ${err}`
			})
		}
	}
)


router.post(
	'/advanced',
	upload.single('file'),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.subject) &&
				validator.isAscii(req.body.clientEmail) &&
				validator.isAscii(req.body.name) &&
				req.body.message &&
				validator.isAscii(req.body.position) &&
				(
					req.body.position == 'option1' ||
					req.body.position == 'option2' ||
					req.body.position == 'option3' ||
					req.body.position == 'option4'
				)
			) {
				// [MAIL-UTIL] //
				if (req.file) {
					const mObj = await mailerUtil.sendAdvancedEmail({
						subject: req.body.subject,
						clientEmail: req.body.clientEmail,
						name: req.body.name,
						message: req.body.message,
						position: req.body.position,
						attachments: [ { path: req.file.path } ],
					})

					if (mObj.status) {
						// [DELETE] //
						fs.unlink(req.file.path, async (err) => {
							if (!err) {
								res.send({
									executed: true,
									status: true,
									message: mObj.message,
								})
							}
							else {
								res.send({
									executed: true,
									status: false,
									location: '/api/mail/careers',
									message: `Caught Error --> ${err}`,
								})
							}
						})
					}
					else {
						// [DELETE] //
						fs.unlink(req.file.path, async (err) => {
							if (!err) {
								res.send(mObj)
							}
							else {
								res.send({
									executed: true,
									status: false,
									location: '/api/mail/careers',
									message: `Caught Error --> ${err}`,
								})
							}
						})
					}
				}
				else {
					const mObj = await mailerUtil.sendAdvancedEmail({
						subject: req.body.subject,
						clientEmail: req.body.clientEmail,
						name: req.body.name,
						message: req.body.message,
						position: req.body.position,
					})

					res.send({
						executed: true,
						status: true,
						message: mObj.message,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: `/api/mail/careers`,
					message: `Invalid params`,
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/mail/careers',
				message: `Caught Error --> ${err}`,
			})
		}
	}
)


module.exports = router