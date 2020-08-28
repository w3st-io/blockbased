/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POST LIKES COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PostLikeModel = require('../server-models/PostLikeModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	const existance = await c_existance(user_id, post_id)

	if (existance.status && !existance.existance) {
		const formData = new PostLikeModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				post: post_id,
			}
		)

		try {
			const createdPostLike = await formData.save()

			return {
				status: true,
				createdPostLike: createdPostLike,
				existance: existance,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `postLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return existance }
}

// [DELETE] //
const c_delete = async (user_id, post_id) => {
	try {
		const deletedPostLike = await PostLikeModel.deleteMany(
			{
				user: user_id,
				post: post_id,
			}
		)

		return {
			status: true,
			deletedPostLike: deletedPostLike,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `postLikesCollection: Caught Error --> ${e}`,
		}
	}
}


// [DELETE-ALL] //
const c_deleteAll = async (post_id) => {
	try {
		const deletedPostLike = await PostLikeModel.deleteMany({ post: post_id })

		return {
			status: true,
			deletedPostLike: deletedPostLike,
		}
	}
	catch (e) {
		return {
			status: false,
			message: `deletedPostLike: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
// [EXISTANCE] //
const c_existance = async (user_id, post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {
			const returned = await PostLikeModel.findOne(
				{
					user: user_id,
					post: post_id,
				}
			)

			if (returned) {
				return {
					status: true,
					existance: true,
				}
			}
			else {
				return {
					status: true,
					existance: false,
				}
			}
		}
		catch (e) {
			return {
				status: false,
				message: `postLikesCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: 'Invalid post_id', } }
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		const count = await PostLikeModel.countDocuments({ post: post_id })

		return { status: true, count: count }
	}
	catch (e) {
		return {
			status: false,
			message: `postLikesCollection: Caught Error --> ${e}`
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