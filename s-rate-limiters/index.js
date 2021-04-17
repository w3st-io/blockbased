// [REQUIRE] Personal //
const rateLimit = require('express-rate-limit')


// [INIT] Const //
const defaultMessage = 'Too many requests, please try again later'


// [RATE-LIMIT] Global //
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // limit each IP to 100 requests per windowMs
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] Post //
const postLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 60,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] Comment //
const commentLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 60,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] Follow //
const followLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] Like //
const likeLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 200,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] Registration //
const registrationLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 20,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


// [RATE-LIMIT] report //
const reportLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 10,
	message: {
		executed: true,
		status: false,
		message: defaultMessage,
	}
})


module.exports = {
	limiter,
	postLimiter,
	commentLimiter,
	followLimiter,
	likeLimiter,
	registrationLimiter,
	reportLimiter,
}