/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POSTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const PostModel = require('../../server-models/PostModel')


/******************* [CRUD] *******************/
// [READ-ALL-ALL] //
const c_readAllAll = async (skip, limit) => {
	// [VALIDATE] skip //
	if (!validator.isNumeric(skip)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid skip (must be numeric)',
		}
	}

	// [VALIDATE] limit //
	if (!validator.isNumeric(limit)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid limit (must be numeric)',
		}
	}

	try {
		const posts = await PostModel.find()
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate({
				path: 'user',
				select: 'username email profileImg',
			})
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postCollections: Error --> ${err}`,
		}
	}
}


// [DELETE] //
const c_delete = async (t_id) => {
	if (!mongoose.isValidObjectId(_id)) {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
			deleted: false,
		}
	}

	try {
		const deletedPost = await PostModel.findByIdAndDelete(_id)
		
		return {
			executed: true,
			status: true,
			deleted: true,
			deletedPost: deletedPost,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `postCollections: Error --> ${err}`,
			deleted: false,
		}
	}
}


// [EXPORT] //
module.exports = {
	c_readAllAll,
	c_delete,
}
