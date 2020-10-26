/**
 * %%%%%%%%%%%%%%%%%%%
 * %%% ADMIN ROUTE %%%
 * %%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../s-collections/commentsCollection')
const postsCollection = require('../../../s-collections/postsCollection')
const usersCollection = require('../../../s-collections/usersCollection')
const commentReportsCollection = require('../../../s-collections/commentReportsCollection')
const Auth = require('../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const userObj = await usersCollection.c_readAll(100000, 0)
			const postObj = await postsCollection.c_readAllAll(100000, 0)
			const commentsObj = await commentsCollection.c_readAllAll(100000, 0)
			const commentReportsObj = await commentReportsCollection.c_readAll(100000, 0)

			// [FORMAT] Remove things that should not be shown //

			res.status(200).send({
				executed: true,
				status: true,
				users: userObj.users,
				posts: postObj.posts,
				comments: commentsObj.comments,
				commentReports: commentReportsObj.commentReports,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router