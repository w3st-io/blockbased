/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENT LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeModel = require('../s-models/CommetLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id, comment_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	// [VALIDATE] //
	if (!mongoose.isValidObjectId(post_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}

	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	// [EXISTANCE] //
	const existance = await c_existance(user_id, comment_id)

	if (!existance.status || existance.existance) { return existance }
	
	try {
		// [SAVE] //
		const commentLike = await new CommentLikeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			comment: comment_id,
		}).save()

		return {
			executed: true,
			status: true,
			commentLike: commentLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentLikesCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] //
const c_delete = async (user_id, comment_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const commentLike = await CommentLikeModel.deleteMany({
			user: user_id,
			comment: comment_id,
		})

		return {
			executed: true,
			status: true,
			commentLike: commentLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentLikesCollection: Error --> ${err}`,
		}
	}
}


// [DELETE-ALL] //
const c_deleteAll = async (comment_id) => {
	// [VALIDATE] //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const commentLikes = await CommentLikeModel.deleteMany({ comment: comment_id })

		return {
			executed: true,
			status: true,
			commentLikes: commentLikes
		}
	}
	catch (err) {
		return {
			executed: true,
			status: false,
			message: `commentLikesCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, comment_id) => {
	// [VALIDATE] user_id //
	if (!mongoose.isValidObjectId(user_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid user_id',
		}
	}

	// [VALIDATE] comment_id //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const returned = await CommentLikeModel.findOne({
			user: user_id,
			comment: comment_id,
		})

		if (!returned) {
			return {
				executed: true,
				status: true,
				message: 'commentLike does NOT exist',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'commentLike does exist',
			existance: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentLikesCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (comment_id) => {
	// [VALIDATE] comment_id //
	if (!mongoose.isValidObjectId(comment_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid comment_id',
		}
	}

	try {
		const count = await CommentLikeModel.countDocuments({ comment: comment_id })

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
			message: `commentLikesCollection: Error --> ${err}`,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_delete,
	c_deleteAll,
	c_existance,
	c_countAll,
}