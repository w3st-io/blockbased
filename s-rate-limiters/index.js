// [REQUIRE] Personal //
const rateLimit = require('express-rate-limit')


// [INIT] Const //
const defaultMessage = 'Too many requests, please try again later'


module.exports = {
	// [GLOBAL] //
	global: rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 500,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [POST] //
	postLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 60,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [COMMENT] //
	commentLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 60,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [FOLLOW] //
	followLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 100,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [LIKE] //
	likeLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 200,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [REGISTRATION] //
	registrationLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 20,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [REPORT] //
	reportLimiter: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 10,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),
}