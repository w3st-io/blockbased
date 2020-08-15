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
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Coment //
const commentLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 60,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Like //
const likelimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 30,
	message: {
		status: false,
		message: 'Too many requests, please try again later',
	}
})


// [RATE-LIMIT] Registration //
const registrationlimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	max: 20,
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
	likelimiter,
	registrationlimiter,
}