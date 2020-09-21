/**
 * %%%%%%%%%%%%%%%%%%%%%%%%
 * %%% INDEX PAGE ROUTE %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const postsCollection = require('../../s-collections/postsCollection')
const Auth = require('../../s-middleware/Auth')
const cats = require('../../s-defaults/cats')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		try {
			for (let i = 0; i < cats.length; i++) {
				// [TOTAL-POSTS] //
				cats[i].totalPosts = (
					await postsCollection.c_countAll(cats[i].cat_id)
				).count
			}
			
			res.send({
				executed: true,
				status: true,
				cats: cats,
			})
		}
		catch (err) {
			res.status(200).send({
				executed: false,
				status: false,
				message: `/pages: Error --> ${err}`
			})
		}
	}
)


// [EXPORT] //
module.exports = router