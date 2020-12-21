/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% FOLLOWS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const PostFollowModel = require('../s-models/PostFollowModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
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
		const createdPostFollow = await new PostFollowModel({
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
			message: `postFollowsCollection: Error --> ${err}`,
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
				message: 'postFollowsCollection: Invalid post_id',
			}
		}

		const postFollows = await PostFollowModel.find({ post: post_id })

		return {
			executed: true,
			status: true,
			postFollows: postFollows,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowsCollection: Error --> ${err}`,
		}
	}
}


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] //
const c_readAllSortByUser = async (sort = 'descending', user_id, limit, skip) => {
	try {
		// [SANTIZE] //
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
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

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'postsCollection: Invalid skip',
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

		if (sort == 'descending') { sort2 = { created_at: -1 } }
		else if (sort == 'popularity') { sort2 = { likeCount: -1 } }

		const postFollows = await PostFollowModel.find({ user: user_id })
			.sort(sort2)
			.skip(skip)
			.limit(limit)
			.exec()

		return {
			executed: true,
			status: true,
			postFollows: postFollows,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowsCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] Post //
const c_deleteByPost = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
				updated: false,
			}
		}

		const deletedPostFollow = await PostFollowModel.deleteMany({
			post: post_id
		})

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowsCollection: Error --> ${err}`,
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
				message: 'postFollowsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
				updated: false,
			}
		}

		const deletedPostFollow = await PostFollowModel.deleteMany({
			user: user_id,
			post: post_id,
		})

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowsCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] Custom //
const c_deleteCustom = async (filter) => {
	try {
		// [VALIDATE] filter //
		if (!filter || filter == {}) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: No filter passed',
				updated: false,
			}
		}

		const deletedPostFollow = await PostFollowModel.deleteMany(filter)

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postFollowsCollection: Error --> ${err}`,
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
				message: 'postFollowsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
				updated: false,
			}
		}

		const postFollow = await PostFollowModel.findOne({
			user: user_id,
			post: post_id,
		})

		if (postFollow) {
			return {
				executed: true,
				status: true,
				existance: true,
				postFollow: postFollow,
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
			message: `postFollowsCollection: Error --> ${err}`,
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
				message: 'postFollowsCollection: Invalid post_id',
			}
		}

		const count = await PostFollowModel.countDocuments({ post: post_id })
		
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
			message: `postFollowsCollection: Error --> ${err}`
		}
	}
}


const c_countAllUser = async (user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'postFollowsCollection: Invalid post_id',
			}
		}

		const count = await PostFollowModel.countDocuments({ user: user_id })
		
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
			message: `postFollowsCollection: Error --> ${err}`
		}
	}
}


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_readAllSortByUser,
	c_deleteByPost,
	c_deleteByUserAndPost,
	c_deleteCustom,
	c_existance,
	c_countAll,
	c_countAllUser,
}
