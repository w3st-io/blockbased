/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const usersCollection = require('../../../s-collections/usersCollection')
const banCollection = require('../../../s-collections/banCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const returned = await usersCollection.c_readAll()

			res.status(201).send(returned)
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


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {
				const returned = await usersCollection.c_update(
					req.decoded._id,
					req.body.img_url
				)

				res.status(201).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/users: Invalid user _id'
			})
		}
	}
)


/******************* [BAN] *******************/
// [UPDATE] Auth Required //
router.post(
	'/ban/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (
			mongoose.isValidObjectId(req.params._id) &&
			Number.isInteger(parseInt(req.body.hours))
		) {
			try {
				const returned = await banCollection.c_create(
					req.params._id,
					parseInt(req.body.hours)
				)

				res.status(201).send(returned)
			}
			catch (err) {
				res.status(200).send({
					executed: false,
					status: false,
					message: `/api/administration/users: Error --> ${err}`,
				})
			}
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: '/api/administration/users: Invalid user _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router