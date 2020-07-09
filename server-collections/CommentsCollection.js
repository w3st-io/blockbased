/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


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


class CommentsCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static create() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			await comments.insertOne({
				createdAt: new Date(),
				block_id: req.body.block_id,
				comment: req.body.comment,
				voters: [],
				user_id: req.decoded._id,
				email: req.decoded.email,
				username: req.decoded.username,
			})
				.then( next() )
				.catch(
					res.status(400).send({
						auth: true,
						message: 'Could Not Create Comment.'
					})
				)
		}
	}


	// [READ-ALL] //
	static readAll() {
		return async (req, res, next) => {
			let skip = parseInt(req.params.skip)
			let amountPerPage = parseInt(req.params.amountPerPage)

			const comments = await loadCommentsCollection()
			const retrievedData = await comments.find(
				{ block_id: req.params.block_id }
			).skip(skip).limit(amountPerPage).toArray()

			// If Data Retrieved Store //
			if (retrievedData) { req.retrievedData = retrievedData }
			else { req.retrievedData = '' }
			
			next()
		}
	}


	// [READ] //
	static read() {
		return async (req, res, next) => {
			let validId = mongodb.ObjectID.isValid(req.params._id)
		
			if (validId) {
				const comments = await loadCommentsCollection()
				const retrievedData = await comments.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)
				
				// If Data Retrieved Store //
				if (retrievedData) { req.retrievedData = retrievedData }
				else { req.retrievedData = '' }
				
				next()
			}
			else {
				res.status(400).send({
					auth: true,
					message: 'Invalid Comment ID.'
				})
			}
		}
	}


	// [UPDATE] //
	static update() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			await comments.findOneAndUpdate(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $set: { comment: req.body.comment, } },
				{ upsert: true }
			)
				.then( next() )
				.catch( res.status(400) )
		}
	}


	// [DELETE] //
	static delete() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			await comments.deleteOne({
				_id: new mongodb.ObjectID(req.params._id),
				user_id: req.decoded._id,
			}).then( next() )
		}
	}


	/******************* [VOTE SYSTEM] *******************/
	static pushVoter() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			await comments.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $push: { 
					voters: {
						user_id: req.decoded._id,
						email: req.decoded.email,
					}
				} },
				{ upsert: true }
			)
				.then( next() )
				.catch( res.status(400) )
		}
	}


	static pullVoter() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			await comments.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $pull: { voters: { user_id: req.decoded._id } } },
				{ upsert: true }
			)
				.then( next() )
				.catch( res.status(400) )
		}
	}


	/******************* [COUNT] *******************/
	static count() {
		return async (req, res, next) => {
			const comments = await loadCommentsCollection()
			const count = await comments.countDocuments(
				{ block_id: req.params.block_id }
			)

			if (count) { req.count = count }
			else { req.count = 0 }

			next()
		}
	}
}


// [EXPORT] //
module.exports = CommentsCollection