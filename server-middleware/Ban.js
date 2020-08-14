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
		const foundBan = await BanModel.findOne({ user: req.decoded._id })

		if (foundBan) console.log('ss', foundBan.bannedTill)
		else next()
	}
}


// [EXPORT] //
module.exports = Ban
