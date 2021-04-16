// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const commentLikesCollection = require('../s-collections/commentLikesCollection')
const CommentModel = require('../s-models/CommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async ({ user_id, post_id, cleanJSON, replyToComment }) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid post_id',
			}
		}

		// [VALIDATE] text //
		if (!cleanJSON) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid cleanJSON',
			}
		}

		// [VALIDATE] replyToComment //
		if (!mongoose.isValidObjectId(replyToComment) && replyToComment !== null) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid replyToComment',
			}
		}

		// [SAVE] //
		const comment = await new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			cleanJSON: cleanJSON,
			replyToComment: replyToComment,
		}).save()
		
		return {
			executed: true,
			status: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [READ] //
const c_read = async ({ user_id, comment_id }) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
			}
		}

		let comment = await CommentModel.findById(comment_id)
			.populate({ path: 'user', select: 'username email bio profile_img' })
			.exec()

		
		if (!comment) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: No comment found',
			}
		}

		// [FILL-DATA] //
		comment = await c_fillData(user_id, comment)

		return {
			executed: true,
			status: true,
			comment: comment
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [UPDATE] //
const c_update = async ({ comment_id, user_id, cleanJSON }) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
				updated: false,
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] text //
		if (!cleanJSON) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid cleanJSON',
			}
		}

		// [OWNERSHIP] //
		const ownership = await c_ownership(comment_id, user_id)

		if (!ownership.status || !ownership.ownership) {
			return {
				executed: true,
				status: false,
				message: ownership.message,
			}
		}
	
		const comment = await CommentModel.updateOne(
			{
				_id: comment_id,
				user: user_id
			},
			{ $set: { cleanJSON: cleanJSON } },
		)

		return {
			executed: true,
			status: true,
			updated: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
			updated: false,
		}
	}
}


// [DELETE] //
const c_delete = async (comment_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
			}
		}

		const deletedComment = await CommentModel.findOneAndRemove({ _id: comment_id })

		return {
			executed: true,
			status: true,
			deleted: true,
			deletedComment: deletedComment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


/******************* [OTHER-CRUD] *******************/
// [READ] sorted//
const c_readSorted = async ({ user_id, sort = 0, limit, skip }) => {
	try {
		// [SANTIZE] //
		sort = parseInt(sort)
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALDIATE] sort //
		if (!Number.isInteger(sort)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid sort',
			}
		}

		// [VALDIATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { created_at: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Unknown filter'
			}
		}

		const comments = await CommentModel.find()
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({ path: 'user', select: 'username email bio profile_img', })
			.populate({ path: 'post' })
			.exec()

		// [FILL-DATA] //
		for (let i = 0; i < comments.length; i++) {
			comments[i] = await c_fillData(user_id, comments[i])
		}
		
		return {
			executed: true,
			status: true,
			comments: comments,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [READ] Post //
const c_readByPost = async ({ user_id, post_id, limit, skip }) => {
	try {
		// [SANTIZE] //
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid post_id',
			}
		}

		// [VALDIATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid skip',
			}
		}

		let comments = await CommentModel.find({ post: post_id })
			.limit(limit)
			.skip(skip)
			.populate({ path: 'user', select: 'username email bio profile_img', })
			.populate({
				path: 'replyToComment',
				populate: {
					path: 'user',
					select: 'username',
				}
			})
			.exec()

		// [FILL-DATA] //
		for (let i = 0; i < comments.length; i++) {
			comments[i] = await c_fillData(user_id, comments[i])
		}

		return {
			executed: true,
			status: true,
			comments: comments
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] comment & user //
const c_deleteByIdAndUser = async ({ comment_id, user_id }) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
				updated: false,
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
				updated: false,
			}
		}

		// [OWNERSHIP] //
		const ownership = await c_ownership(comment_id, user_id)

		if (!ownership.status || !ownership.ownership) {
			return {
				executed: true,
				status: false,
				message: ownership.message
			}
		}

		const comment = await CommentModel.findOneAndRemove({
			_id: comment_id,
			user: user_id,
		})

		return {
			executed: true,
			status: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] post //
const c_deleteByPost = async (post_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid post_id',
				updated: false,
			}
		}

		const comments = await CommentModel.deleteMany({ post: post_id })

		return {
			executed: true,
			status: true,
			comment: comments,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
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
				message: 'commentCollection: No filter passed',
				updated: false,
			}
		}

		const comment = await CommentModel.deleteMany(filter)

		return {
			executed: true,
			status: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`,
		}
	}
}


/******************* [OWNERSHIP] *******************/
const c_ownership = async (comment_id, user_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
				updated: false,
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id',
				updated: false,
			}
		}

		const comment = await CommentModel.findOne({ _id: comment_id, user: user_id, })

		if (!comment) {
			return {
				executed: true,
				status: true,
				message: 'You do NOT own this comment',
				ownership: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'You do own this comment',
			ownership: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (comment_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id'
			}
		}

		const comment = await CommentModel.findOne({ _id: comment_id })

		if (!comment) {
			return {
				executed: true,
				status: true,
				message: 'Comment does NOT exist',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Comment does exist',
			existance: true,
			comment: comment,
		}
		
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


/******************* [COUNT] *******************/
const c_count = async () => {
	try {
		const count = await CommentModel.countDocuments()

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
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


const c_countByUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid user_id'
			}
		}

		const count = await CommentModel.countDocuments({ user: user_id })

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
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


const c_countByPost = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid post_id'
			}
		}

		const count = await CommentModel.countDocuments({ post: post_id })

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
			message: `commentsCollection: Error --> ${err}`
		}
	}
}


/******************* [FILL-DATA] *******************/
const c_fillData = async (user_id, comment) => {
	// [COUNT] Likes //
	comment.likeCount = (
		await commentLikesCollection.c_countByComment(comment._id)
	).count

	// [USER-LOGGED] //
	if (user_id) {
		// [LIKED-STATE] //
		comment.liked = (
			await commentLikesCollection.c_existance({
				user_id: user_id,
				comment_id: comment._id
			})
		).existance
	}

	return comment
}


module.exports = {
	c_create,
	c_read,
	c_update,
	c_delete,
	c_readSorted,
	c_readByPost,
	c_deleteByIdAndUser,
	c_deleteByPost,
	c_deleteCustom,
	c_existance,
	c_ownership,
	c_count,
	c_countByUser,
	c_countByPost,
	c_fillData,
}