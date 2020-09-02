/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION USER ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const usersCollection = require('../../../server-collections/usersCollection')
const banCollection = require('../../../server-collections/banCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL] Auth Required //
router.get(
	'/read-all/profile-data',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await usersCollection.c_readAll()

		res.status(201).send(returned)
	}
)


// [UPDATE] Auth Required //
router.post(
	'/update/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await usersCollection.c_update(
				req.decoded._id,
				req.body.img_url
			)

			res.status(201).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid user _id'
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
		if (mongoose.isValidObjectId(req.params._id)) {
			const returned = await banCollection.c_create(
				req.params._id,
				req.body.hours
			)

			res.status(201).send(returned)
		}
		else {
			res.status(200).send({
				executed: true,
				status: false,
				message: 'Invalid user _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router