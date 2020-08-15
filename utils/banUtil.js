/**
 * %%%%%%%%%%%%%%%%%%% *
 * %%% BAN Utility %%% *
 * %%%%%%%%%%%%%%%%%%% *
*/


// [REQUIRE] Personal //
const BanModel = require('../server-models/BanModel')


class Ban {
	// Check If Banned //
	static async checkBanned(decoded) {
		let foundBan = ''
		
		if (decoded) {
			try { foundBan = await BanModel.findOne({ user: decoded._id }) }
			catch (e) {
				return {
					status: true,
					message: `Caught Error --> ${e}`,
					foundBan: foundBan,
				}
			}

			return {
				status: true,
				message: 'Searched for ban',
				foundBan: foundBan,
			}
		}
		else {
			return {
				status: false,
				message: 'No decoded',
				foundBan: foundBan,
			}
		}
	}
}


// [EXPORT] //
module.exports = Ban
