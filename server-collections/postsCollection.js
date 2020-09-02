/**
 * %%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% POSTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] //
const PostModel = require('../server-models/PostModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, cat_id, title) => {
	const formData = new PostModel({
		_id: mongoose.Types.ObjectId(),
		user: user_id,
		cat_id: cat_id,
		title: title,
	})

	try {
		const createdPost = await formData.save()

		return {
			executed: true,
			status: true,
			createdPost: createdPost,
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Caught Error --> ${e}`,
		}
	}
}


// [READ-ALL] Within Cat //
const c_readAll = async (cat_id, skip, limit, sort) => {
	let sort2

	if (sort == 'descending') { sort2 = { createdAt: -1 } }
	else if (sort == 'popularity') { sort2 = { likeCount: -1 } }

	try {
		const posts = await PostModel.find(
			{ cat_id: cat_id }
		)
			.sort(sort2)
			.skip(parseInt(skip))
			.limit(parseInt(limit))
			.populate(
				{
					path: 'user',
					select: 'username email profileImg',
				}
			)
			.exec()

		return {
			executed: true,
			status: true,
			posts: posts
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Caught Error --> ${e}`,
		}
	}
}

// [READ] Single Post //
const c_read = async (post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {
			const post = await PostModel.findById(post_id)
				.populate(
					{
						path: 'user',
						select: 'username email profileImg',
					}
				)
				.exec()
			
			return {
				executed: true,
				status: true,
				post: post
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `postsCollection: Caught Error --> ${e}`
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


/******************* [LIKE-SYSTEM] *******************/
const c_incrementLike = async (post_id) => {
	try {
		const post = await PostModel.findOneAndUpdate(
			{ _id: post_id },
			{ $inc: { likeCount: 1 } },
		)
	
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Caught Error --> ${e}`
		}
	}
}


const c_decrementLike = async (post_id) => {
	try {
		const post = await PostModel.findOneAndUpdate(
			{ _id: post_id },
			{ $inc: { likeCount: -1 } },
		)
	
		return {
			executed: true,
			status: true,
			post: post
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Caught Error --> ${e}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {	
			const post = await PostModel.findOne({ _id: post_id })

			if (post) {
				return {
					executed: true,
					status: true,
					existance: true,
					post: post,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					existance: false,
					post: post,
				}
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `postsCollection: Caught Error --> ${e}`,
				existance: false,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
			existance: false,
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (user_id, post_id) => {
	if (mongoose.isValidObjectId(post_id)) {
		try {	
			const post = await PostModel.findOne(
				{
					user: user_id,
					_id: post_id,
				}
			)

			if (returned) {
				return {
					executed: true,
					status: true,
					ownership: true,
					post: post,
				}
			}
			else {
				return {
					executed: true,
					status: true,
					ownership: false,
					post: post,
				}
			}
		}
		catch (e) {
			return {
				executed: false,
				status: false,
				message: `postsCollection: Caught Error --> ${e}`,
			}
		}
	}
	else {
		return {
			executed: true,
			status: false,
			message: 'Invalid post _id',
		}
	}
}


/******************* [COUNT] *******************/
const c_countAll = async (cat_id) => {
	try {
		const count = await PostModel.countDocuments({ cat_id: cat_id })

		return {
			executed: true,
			status: true,
			count: count
		}
	}
	catch (e) {
		return {
			executed: false,
			status: false,
			message: `postsCollection: Caught Error --> ${e}`,
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
