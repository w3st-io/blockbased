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
			const { users } = await usersCollection.c_readSorted(0, 100000, 0)
			const { posts } = await postsCollection.c_readSorted(0, 100000, 0)
			const { comments } = await commentsCollection.c_readSorted(0, 100000, 0)
			const { commentReports } = await commentReportsCollection.c_readUnhandled(
				0, 100000, 0
			)

			res.status(200).send({
				executed: true,
				status: true,
				users: users,
				posts: posts,
				comments: comments,
				commentReports: commentReports,
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