// [REQUIRE] //
const config = require('../s-config')


class Auth {
	static admin() {
		return (req, res, next) => {
			if (config.ADMIN_FUNCTIONALITY === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality',
					message: 'This app does not support a user/admin system',
				})
			}
		}
	}

	static user() {
		return (req, res, next) => {
			if (config.USER_FUNCTIONALITY === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality',
					message: 'This app does not support a user/admin system',
				})
			}
		}
	}

	static payments() {
		return (req, res, next) => {
			if (config.PAYMENT_FUNCTIONALITY === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality',
					message: 'This app does not support a payment system',
				})
			}
		}
	}

	static comments() {
		return (req, res, next) => {
			if (config.COMMENT_FUNCTIONALITY === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality',
					message: 'Comment functionalities are disabled',
				})
			}
		}
	}

	static posts() {
		return (req, res, next) => {
			if (config.POST_FUNCTIONALITY === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality',
					message: 'Post functionalities are disabled',
				})
			}
		}
	}
}


module.exports = Auth
