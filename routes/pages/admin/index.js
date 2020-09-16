/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const commentsCollection = require('../../../server-collections/commentsCollection')
const postsCollection = require('../../../server-collections/postsCollection')
const usersCollection = require('../../../server-collections/usersCollection')
const commentReportsCollection = require('../../../server-collections/commentReportsCollection')
const Auth = require('../../../server-middleware/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/',
	Auth.adminToken(),
	async (req, res) => {
		try {
			const users = await usersCollection.c_readAll()
			const posts = await postsCollection.c_readAllAll(0, 100000)
			const comments = await commentsCollection.c_readAllAll(0, 100000)
			const commentReports = await commentReportsCollection.c_readAll()

			res.status(201).send({
				executed: true,
				status: true,
				users: users.users,
				posts: posts.posts,
				comments: comments.comments,
				commentReports: commentReports.commentReports,
			})
		}
		catch (err) {
			res.status(201).send({
				executed: false,
				status: false,
				message: `/page/admin/index: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router