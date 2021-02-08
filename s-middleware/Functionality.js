// [REQUIRE] //
const config = require('../s-config')

class Auth {
	/******************* [ADMIN] *******************/
	static adminUserSystem() {
		return (req, res, next) => {
			console.log(config.ADMIN_USER_SYSTEM)

			next()
		}
	}
}


// [EXPORT] //
module.exports = Auth
