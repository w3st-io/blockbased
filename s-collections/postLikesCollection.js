// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PostLikeModel = require('../s-models/PostLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id, postUser_id) => {
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
	
		// [VALIDATE] postUser_id //
		if (!mongoose.isValidObjectId(postUser_id)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid postUser_id',
			}
		}

		// [SAVE] //
		const postLike = await new PostLikeModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			postUser: postUser_id,
		}).save()

		return {
			executed: true,
			status: true,
			postLike:postLike,
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


/******************* [OTHER-CRUD] *******************/
// [DELETE] Post //
const c_deleteByPost = async (post_id) => {
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


// [DELETE] User & Post //
const c_deleteByUserAndPost = async (user_id, post_id) => {
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
				message: 'postLike does NOT exist',
				existance: false,
			}
		}
		return {
			executed: true,
			status: true,
			message: 'postLike does exist',
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
const c_countByPost = async (post_id) => {
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


const c_countByPostUser = async (postUser) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(postUser)) {
			return {
				executed: true,
				status: false,
				message: 'postLikesCollection: Invalid post_id',
			}
		}
	
		const count = await PostLikeModel.countDocuments({ postUser })

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


module.exports = {
	c_create,
	c_deleteByPost,
	c_deleteByUserAndPost,
	c_existance,
	c_countByPost,
	c_countByPostUser,
}