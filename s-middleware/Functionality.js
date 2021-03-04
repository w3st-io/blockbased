// [REQUIRE] //
const config = require('../s-config')


class Auth {
	static adminUserSystem() {
		return (req, res, next) => {
			if (config.ADMIN_USER_SYSTEM === true) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality/',
					message: 'This app does not support a user/admin system',
				})
			}
		}
	}

	static paymentsSystem() {
		return (req, res, next) => {
			if (config.PAYMENT_SYSTEM === true) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality/',
					message: 'This app does not support a payment system',
				})
			}
		}
	}

	static commentsSystem() {
		return (req, res, next) => {
			if (config.COMMENT_FUNCTIONALITY === true) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality/',
					message: 'Comment functionalities are disabled',
				})
			}
		}
	}

	static postsSystem() {
		return (req, res, next) => {
			if (config.POST_FUNCTIONALITY === true) { next() }
			else {
				res.status(200).send({
					executed: true,
					status: false,
					location: '/s-middleware/Functionality/',
					message: 'Post functionalities are disabled',
				})
			}
		}
	}
}


// [EXPORT] //
module.exports = Auth
