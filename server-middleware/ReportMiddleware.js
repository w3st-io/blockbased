/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% REPORT MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
require('dotenv').config()


// [REQUIRE] Personal //
const Collections = require('../server-collections')


class ReportMiddleware {
	// Verify that User is not Double Inserting //
	static verifyNonExistance() {
		return async (req, res, next) => {
			const reports = await Collections.loadReportsCollection()
			let returnedData = await reports.findOne({	
				comment_id: req.body.comment_id,
				user_id: req.decoded._id,
			})

			if (returnedData) {
				console.log('error')
				return res.status(401).send({
					auth: false,
					error: 'You have already reported this comment.'
				})
			}
			else { next() }
		}
	}
}


// [EXPORT] //
module.exports = ReportMiddleware
