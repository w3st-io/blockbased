/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% ADMIN FUNCTION ROUTE %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../../s-collections/commentsCollection')
const postsCollection = require('../../../../s-collections/postsCollection')
const usersCollection = require('../../../../s-collections/usersCollection')
const commentReportsCollection = require('../../../../s-collections/commentReportsCollection')
const Auth = require('../../../../s-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const usersObj = await usersCollection.c_readAll(100000, 0)
			const postObj = await postsCollection.c_readAll(100000, 0)
			const commentsObj = await commentsCollection.c_readAll(100000, 0)
			const commentReportsObj = await commentReportsCollection.c_readUnhandled(100000, 0)

			if (usersObj.status) {
				usersObj.users.forEach(user => {
					// [FORMAT] Remove things that should not be shown //
					user.password = undefined
				})
			}

			res.status(200).send({
				executed: true,
				status: true,
				users: usersObj.users,
				posts: postObj.posts,
				comments: commentsObj.comments,
				commentReports: commentReportsObj.commentReports,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages/admin/function: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router