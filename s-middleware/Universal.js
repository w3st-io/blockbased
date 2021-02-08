// [REQUIRE] //
const config = require('../s-config')

class Auth {
	/******************* [ADMIN] *******************/
	static userSystem() {
		return (req, res, next) => {
			console.log(config.USER_SYSTEM)

			next()
		}
	}
}


// [EXPORT] //
module.exports = Auth
