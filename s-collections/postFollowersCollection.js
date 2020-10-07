/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% FOLLOWS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const PostFollowerModel = require('../s-models/PostFollowerModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
				updated: false,
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
		const createdPostFollow = await new PostFollowerModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
		}).save()

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


// [READ-ALL] //
const c_readAll = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
			}
		}

		const postFollowers = await PostFollowerModel.find({ post: post_id })

		return {
			executed: true,
			status: true,
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
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
				updated: false,
			}
		}

		const deletedPostFollower = await PostFollowerModel.deleteMany({
			user: user_id,
			post: post_id,
		})

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


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] //
const c_readAllUser = async (user_id, skip, limit, sort = 'descending') => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid skip',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid limit',
			}
		}

		// [VALIDATE] sort //
		if (!validator.isAscii(sort)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid sort',
			}
		}

		// [INIT] //
		let sort2

		if (sort == 'descending') { sort2 = { createdAt: -1 } }
		else if (sort == 'popularity') { sort2 = { likeCount: -1 } }

		const postFollowers = await PostFollowerModel.find({ user: user_id })
			.sort(sort2)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.exec()

		return {
			executed: true,
			status: true,
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


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
				updated: false,
			}
		}

		const postFollower = await PostFollowerModel.findOne({
			user: user_id,
			post: post_id,
		})

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


/******************* [COUNT] *******************/
const c_countAll = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowersCollection: Invalid post_id',
			}
		}

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
	c_readAllUser,
	c_existance,
	c_countAll,
}
