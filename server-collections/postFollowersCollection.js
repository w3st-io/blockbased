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
		const formData = new PostFollowerModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
		})

		try {
			const createdPostFollow = await formData.save()

			return {
				executed: true,
				status: true,
				createdPostFollow: createdPostFollow,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `postFollowersCollection: Error --> ${err}`,
			}
		}
	}
	else { return existance }
}

// [READ-ALL] //
const c_readAll = async (post_id) => {
	try {
		const postFollowers = await PostFollowerModel.find({ post: post_id })

		return {
			executed: true,
			status: true,
			message: 'Found',
			postFollowers: postFollowers,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowersCollection: Error --> ${err}`,
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
			executed: true,
			status: true,
			deletedPostFollower: deletedPostFollower
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowersCollection: Error --> ${err}`,
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
					executed: true,
					status: true,
					existance: true,
					postFollower: postFollower,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					existance: false,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `postFollowersCollection: Error --> ${err}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid post_id',
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		const count = await PostFollowerModel.countDocuments({ post: post_id })
		
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
			message: `postFollowersCollection: Error --> ${err}`
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
