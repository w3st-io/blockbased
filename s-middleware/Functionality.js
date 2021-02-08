// [REQUIRE] //
const config = require('../s-config')


class Auth {
	static adminUserSystem() {
		return (req, res, next) => {
			if (config.ADMIN_USER_SYSTEM) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'This app does not support a user/admin system'
				})
			}
		}
	}

	static paymentsSystem() {
		return (req, res, next) => {
			if (config.PAYMENT_SYSTEM) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					message: 'This app does not support a payment system'
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = Auth
