/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POSTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const PostModel = require('../server-models/PostModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, cat_id, title) => {
	// [VALIDATE] //
	if (
		!mongoose.isValidObjectId(user_id) &&
		!validator.isAscii(cat_id) &&
		!validator.isAscii(title)
	) {
		return {
			executed: true,
			status: false,
			message: 'Invalid params',
		}
	}

	try {
		// [SAVE] //
		const createdPost = await new PostModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			cat_id: cat_id,
			title: title,
		}).save()

		return {
			executed: true,
			status: true,
			createdPost: createdPost,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [READ-ALL] Within Cat //
const c_readAll = async (cat_id, skip, limit, sort) => {
	// [INIT] //
	let sort2

	// [VALIDATE] //
	if (
		!validator.isAscii(cat_id) &&
		!validator.isAscii(skip) &&
		!validator.isAscii(limit) &&
		!validator.isAscii(sort)
	) {
		return {
			executed: true,
			status: false,
			message: 'Invalid params',
		}
	}

	if (sort == 'descending') { sort2 = { createdAt: -1 } }
	else if (sort == 'popularity') { sort2 = { likeCount: -1 } }

	try {
		const posts = await PostModel.find({ cat_id: cat_id })
			.sort(sort2)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate({ path: 'user', select: 'username email profileImg', })
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [READ] Single Post //
const c_read = async (_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'postsCollection: Invalid post _id',
		}
	}

	// [EXISTANCE] //
	const existance = await c_existance(_id)
	
	if (!existance.existance) { return existance }

	try {
		const post = await PostModel.findById(_id)
			.populate({ path: 'user', select: 'username email profileImg', })
			.exec()
		
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


/******************* [LIKE-SYSTEM] *******************/
const c_incrementLike = async (_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'postCollection: Invalid post _id',
		}
	}

	try {
		const post = await PostModel.findOneAndUpdate(
			{ _id },
			{ $inc: { likeCount: 1 } },
		)
	
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


const c_decrementLike = async (_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
		}
	}

	try {
		const post = await PostModel.findOneAndUpdate(
			{ _id },
			{ $inc: { likeCount: -1 } },
		)
	
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
			existance: false,
		}
	}

	try {	
		const post = await PostModel.findOne({ _id })

		if (!post) {
			return {
				executed: true,
				status: false,
				message: `Post does NOT exist`,
				existance: false,
				post: post,
			}
		}

		return {
			executed: true,
			status: true,
			message: `Post does exist`,
			existance: true,
			post: post,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
			existance: false,
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (user_id, _id) => {
	// [VALIDATE] //
	if (
		!mongoose.isValidObjectId(user_id) ||
		!mongoose.isValidObjectId(_id)
	) {
		return {
			executed: true,
			status: false,
			message: 'Invalid id(s)',
		}
	}

	try {	
		const post = await PostModel.findOne({ _id, user: user_id })

		if (!post) {
			return {
				executed: true,
				status: true,
				ownership: false,
				post: post,
			}
		}

		return {
			executed: true,
			status: true,
			ownership: true,
			post: post,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (cat_id) => {
	try {
		const count = await PostModel.countDocuments({ cat_id })

		return {
			executed: true,
			status: true,
			count: count
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_read,
	c_incrementLike,
	c_decrementLike,
	c_existance,
	c_ownership,
	c_countAll,
}
