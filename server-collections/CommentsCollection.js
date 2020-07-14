/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const CommentModel = require('../models/CommentModel')


// [LOAD COLLECTION] comments //
async function loadCommentsCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'comments'

	const client = await mongodb.MongoClient.connect(
		uri,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)

	return client.db(db_name).collection(c_name)
}

// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class CommentsCollection {
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new CommentModel({
			_id: mongoose.Types.ObjectId(),
			block_id: req.body.block_id,
			user: req.decoded._id,
			comment: req.body.comment,
			likers: [],
		})

		formData.save()

		return 'Created block.'
	}


	// [READ-ALL-ALL] //
	static async readAllAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)
		
		try {
			const comments = await loadCommentsCollection()
			const returnedData = await comments.find()
				.skip(skip)
				.limit(amount)
				.toArray()
				
			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}
	


	// [READ-ALL] Within a Block //
	static async readAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const returnedData = await CommentModel.find(
				{ block_id: new mongodb.ObjectID(req.params.block_id) }
			)
				.skip(skip)
				.limit(amount)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.populate('user_id')
				.exec()

				console.log(returnedData)
				
				return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ] //
	static async read(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)
		
		if (validId) {
			try {
				const comments = await loadCommentsCollection()
				const returnedData = await comments.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)
				
				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [UPDATE] //
	static async update(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const comments = await loadCommentsCollection()
				await comments.findOneAndUpdate(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ $set: { comment: req.body.comment, } },
					{ upsert: true }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	// [DELETE] //
	static async delete(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const comments = await loadCommentsCollection()
				await comments.deleteOne({
					_id: new mongodb.ObjectID(req.params._id),
					user_id: new mongodb.ObjectID(req.decoded._id),
				})
				
				next()
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	/******************* [VOTE SYSTEM] *******************/
	static async like(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const comments = await loadCommentsCollection()
				await comments.updateOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ $addToSet: {
						likers: { user_id: new mongodb.ObjectID(req.decoded._id) }
					} },
					{ upsert: true }
				)
				
				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	static async unlike(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				const comments = await loadCommentsCollection()
				await comments.updateOne(
					{ _id: new mongodb.ObjectID(req.params._id) },
					{ $pull: {
						likers: { user_id: new mongodb.ObjectID(req.decoded._id) }
					} },
					{ upsert: true }
				)

				return
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Comment ID.' }
	}


	/******************* [EXISTANCE] *******************/
	static async LikeExistance(req) {
		try {
			const comments = await loadCommentsCollection()
			const returnedData = await comments.findOne({
				_id: new mongodb.ObjectID(req.params._id),
				likers: {
					user_id: new mongodb.ObjectID(req.decoded._id),
				}
			})

			console.log(returnedData)

			if (returnedData) { return true }
			else { return false }
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	
	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(comment_id) {
		if (mongodb.ObjectID.isValid(comment_id)) {
			try {
				const comments = await loadCommentsCollection()
				const returnedData = await comments.findOne(
					{ _id: new mongodb.ObjectID(comment_id) }
				)
				
				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [OWNERSHIP] //
	static async ownership(req) {
		if (mongodb.ObjectID.isValid(req.params._id)) {
			try {
				const comments = await loadCommentsCollection()
				const returnedData = await comments.findOne(
					{	
						_id: new mongodb.ObjectID(req.params._id),
						user_id: new mongodb.ObjectID(req.decoded._id),
					}
				)

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [COUNT] *******************/
	static async count(req) {
		try {
			const comments = await loadCommentsCollection()
			const count = await comments.countDocuments({
				block_id: new mongodb.ObjectID(req.params.block_id)
			})

			return count
		}
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = CommentsCollection