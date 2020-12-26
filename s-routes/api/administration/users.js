/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMINISTRATION USER ROUTES %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const usersCollection = require('../../../s-collections/usersCollection')
const bansCollection = require('../../../s-collections/bansCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [UPDATE] Auth Required //
router.post(
	'/update',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.body.user_id) &&
				validator.isAscii(req.body.img_url) &&
				validator.isAscii(req.body.bio)
			) {
				const returned = await usersCollection.c_update(
					req.body.user_id,
					req.body.img_url,
					req.body.bio
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/users: Invalid params'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/users: Error --> ${err}`,
			})
		}
	}
)


/******************* [BAN] *******************/
// [UPDATE] Auth Required //
router.post(
	'/ban',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				mongoose.isValidObjectId(req.body.user_id) &&
				Number.isInteger(parseInt(req.body.hours))
			) {
				const returned = await bansCollection.c_create(
					req.body.user_id,
					parseInt(req.body.hours)
				)

				res.status(200).send(returned)
			}
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: '/api/administration/users: Invalid user_id'
				})
			}
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/api/administration/users: Error --> ${err}`,
			})
		}
	}
)


// [EXPORT] //
module.exports = router