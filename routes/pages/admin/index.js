/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% ADMIN ROUTE %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const usersCollection = require('../../../server-collections/usersCollection')
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
			const posts = await usersCollection.c_readAll()
			const comments = await usersCollection.c_readAll()
			const reports = await usersCollection.c_readAll()
		}
		catch (err) {
			
		}
		

		if (users.status) { sendBack.users = users.users }

		res.status(201).send()
	}
)


// [EXPORT] //
module.exports = router