/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%
 * %%% COMMENTS COLLECTION %%%
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentModel = require('../s-models/CommentModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id, text, replyToComment) => {
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
		if (!text) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid text',
			}
		}

		// replyToComment //
		if (!mongoose.isValidObjectId(replyToComment) && replyToComment !== null) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid replyToComment',
			}
		}

		// Text Length //
		if (text.length >= 6000) {
			return {
				executed: true,
				status: false,
				message: 'Comment too long',
			}
		}

		// Text XSS //
		if (text.includes('<script') || text.includes('</script>')) {
			return {
				executed: true,
				status: false,
				message: 'XSS not aloud',
			}
		}

		// [SAVE] //
		const comment = await new CommentModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
			replyToComment,
			text,
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
const c_read = async (comment_id) => {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid comment_id',
			}
		}

		const comment = await CommentModel.findById(comment_id)
			.populate({ path: 'user', select: 'username email bio profile_img' })
			.exec()

		if (!comment) {
			return {
				executed: true,
				status: false,
				message: 'No comment found',
			}
		}

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


// [READ-ALL] //
const c_readAll = async (limit, skip) => {
	try {
		// [SANTIZE] //
		limit = parseInt(limit)
		skip = parseInt(skip)

		// [VALDIATE] limit //
		if (!Number.isInteger(limit)) {
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

		const comments = await CommentModel.find()
			.skip(skip)
			.limit(limit)
			.populate({ path: 'user', select: 'username email bio profile_img', })
			.populate({ path: 'post' })
			.exec()
		
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


// [UPDATE] //
const c_update = async (comment_id, user_id, text) => {
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
		if (!text) {
			return {
				executed: true,
				status: false,
				message: 'commentsCollection: Invalid text',
			}
		}

		// Length //
		if (text.length >= 6000) {
			return {
				executed: true,
				status: false,
				message: 'Comment too long',
				updated: false,
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
			{ $set: { text: text } },
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
// [READ-ALL] Within a Post //
const c_readAllByPost = async (post_id, limit, skip) => {
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
		if (!Number.isInteger(limit)) {
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

		const comments = await CommentModel.find({ post: post_id })
			.skip(skip)
			.limit(limit)
			.populate({ path: 'user', select: 'username email bio profile_img', })
			.populate({
				path: 'replyToComment',
				populate: {
					path: 'user',
					select: 'username',
				}
			})
			.exec()

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
const c_deleteByIdAndUser = async (comment_id, user_id) => {
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
				message: 'commentLikesCollection: No filter passed',
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
const c_countAllByUser = async (user_id) => {
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


const c_countAllByPost = async (post_id) => {
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


// [EXPORT] //
module.exports = {
	c_create,
	c_readAll,
	c_read,
	c_update,
	c_delete,
	c_readAllByPost,
	c_deleteByIdAndUser,
	c_deleteByPost,
	c_deleteCustom,
	c_existance,
	c_ownership,
	c_countAllByUser,
	c_countAllByPost,
}