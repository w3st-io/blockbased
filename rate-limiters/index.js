/**
 * %%%%%%%%%%%%%%%%%%%%% *
 * %%% RATE-LIMITERS %%% *
 * %%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] Personal //
const rateLimit = require('express-rate-limit')


// [RATE-LIMIT] Global //
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // limit each IP to 100 requests per windowMs
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Block //
const blockLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 60,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Comment //
const commentLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 60,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Follow //
const followLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Like //
const likeLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 200,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Registration //
const registrationLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 20,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Registration //
const reportLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 10,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [EXPORTS] //
module.exports = {
	limiter,
	blockLimiter,
	commentLimiter,
	followLimiter,
	likeLimiter,
	registrationLimiter,
	reportLimiter,
}