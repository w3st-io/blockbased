/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 */
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const PostFollowerModel = require('../server-models/PostFollowerModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	const existance = await c_existance(user_id, post_id)

	if (existance.status && !existance.existance) {
		const formData = new PostFollowerModel(
			{
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				post: post_id,
			}
		)

		try {
			const createdPostFollow = await formData.save()

			return {
				status: true,
				createdPostFollow: createdPostFollow,
			}
		}
		catch (e) {
			return {
				status: false,
				message: `postFollowersCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: existance.message } }
}

// [READ-ALL] //
const c_readAll = async (post_id) => {
	try {
		const postFollowers = await PostFollowerModel.find({ post: post_id })

		return {
			status: true,
			message: 'Found',
			postFollowers: postFollowers,
		}
	}
	catch (e) {
		return {
			status: false,
			message: 'postFollowersCollection: Error',
		}
	}
}

// [DELETE] //
const c_delete = async (user_id, post_id) => {
	try {
		const deletedPostFollower = await PostFollowerModel.deleteMany(
			{
				user: user_id,
				post: post_id,
			}
		)

		return {
			status: true,
			deletedPostFollower: deletedPostFollower
		}
	}
	catch (e) {
		return {
			status: false,
			message: `postFollowersCollection: Caught Error --> ${e}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id, post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {
			const postFollower = await PostFollowerModel.findOne(
				{
					user: user_id,
					post: post_id,
				}
			)

			if (postFollower) {
				return {
					status: true,
					existance: true,
					postFollower: postFollower,
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
				message: `postFollowersCollection: Caught Error --> ${e}`,
			}
		}
	}
	else { return { status: false, message: 'Invalid post_id', } }
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		const count = await PostFollowerModel.countDocuments({ post: post_id })
		
		return { status: true, count: count }
	}
	catch (e) {
		return {
			status: false,
			message: `postFollowersCollection: Caught error --> ${e}`
		}
	}

}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_delete,
	c_existance,
	c_countAll,
}
