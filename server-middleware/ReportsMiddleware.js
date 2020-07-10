/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% REPORT MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongodb = require('mongodb')


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class ReportsMiddleware {
	// Verify that User is not Double Inserting //
	static verifyNonExistance() {
		return async (req, res, next) => {
			const validId = mongodb.ObjectID.isValid(req.body.comment_id)

			if (validId) {
				try {
					const reports = await Collections.loadReportsCollection()
					const returnedData = await reports.findOne({	
						comment_id: req.body.comment_id,
						user_id: req.decoded._id,
					})

					if (returnedData) {
						return res.status(400).send({
							auth: true,
							error: 'You have already reported this comment.'
						})
					}
					else { next() }
				}
				catch(e) {
					res.status(400).send({
						auth: true,
						message: `Caught Error: ${e}`,
					})
				}
			}
			else {
				res.status(400).send({
					auth: true,
					message: 'Invalid Block ID.'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = ReportsMiddleware
