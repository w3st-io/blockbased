/**
 * %%%%%%%%%%%%%%%%%%%%%% *
 * %%% BAN MIDDLEWARE %%% *
 * %%%%%%%%%%%%%%%%%%%%%% *
*/


// [REQUIRE] Personal //
const BanModel = require('../server-models/BanModel')


class Ban {
	// Check If Banned //
	static checkBanned() {
		return (req, res, next) => {
			console.log('ban', req.decoded)
			
			if (req.decoded) {
				let foundBan = ''

				try { foundBan = BanModel.findOne({ user: req.decoded._id }) }
				catch (e) { console.log(e) }
		
				if (foundBan) { console.log('foundBan:', foundBan) }
			}
			else { console.log('No req.decoded') }

			next()
		}
	}
}


// [EXPORT] //
module.exports = Ban
