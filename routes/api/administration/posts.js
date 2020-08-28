/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% ADMINISTRATION BLOCK ROUTES %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const aPostsCollection = require('../../../server-collections/administration/postsCollection')
const postLikesCollection = require('../../../server-collections/postLikesCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [CRUD] *******************/
// [READ-ALL-ALL] Auth Required //
router.get(
	'/read-all-all/:limit/:skip',
	Auth.adminToken(),
	async (req, res) => {
		const returned = await aPostsCollection.c_readAllAll(
			req.params.skip,
			req.params.limit
		)

		res.status(200).send(returned)
	}
)


// [DELETE] Auth Required //
router.delete(
	'/delete/:_id',
	Auth.adminToken(),
	async (req, res) => {
		if (mongoose.isValidObjectId(req.params._id)) {
			aPostsCollection.c_delete(req.params._id)
			postLikesCollection.c_deleteAll(req.params._id)

			res.sendStatus(200)
		}
		else {
			res.status(200).send({
				status: false,
				message: 'a posts: Invalid _id'
			})
		}
	}
)


// [EXPORT] //
module.exports = router