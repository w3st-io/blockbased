/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PostLikeModel = require('../s-models/PostLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}
	
		// [EXISTANCE] //
		const existance = await c_existance(user_id, post_id)

		if (!existance.status || existance.existance) {
			return {
				executed: true,
				status: false,
				message: existance.message,
			}
		}

		// [SAVE] //
		const createdPostLike = await new PostLikeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
		}).save()

		return {
			executed: true,
			status: true,
			createdPostLike: createdPostLike,
			existance: existance,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
	
}

// [DELETE] //
const c_delete = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}
	

		const postLike = await PostLikeModel.deleteMany({
			user: user_id,
			post: post_id,
		})

		return {
			executed: true,
			status: true,
			deletedPostLike: postLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
}


// [DELETE-ALL] //
const c_deleteAll = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}

		const postLike = await PostLikeModel.deleteMany({ post: post_id })

		return {
			executed: true,
			status: true,
			deletedPostLike: postLike,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `deletedPostLike: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}

		if (!await PostLikeModel.findOne({ user: user_id, post: post_id })) {
			return {
				executed: true,
				status: true,
				existance: false,
			}
		}
		return {
			executed: true,
			status: true,
			existance: true,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postLikesCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}
	
		const count = await PostLikeModel.countDocuments({ post: post_id })

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
			message: `postLikesCollection: Error --> ${err}`
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