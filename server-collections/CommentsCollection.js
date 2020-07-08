/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% COMMENTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


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
			let retrievedData = await comments.find(
				{ block_id: req.params.block_id }
			).skip(skip).limit(amountPerPage).toArray()

			// If Data Retrieved Store //
			if (retrievedData) { req.retrievedData = retrievedData }
			else { retrievedData = '' }
			
			next()
		}
	}


	// [READ] //
	static read() {
		return async (req, res, next) => {
			let validId = mongodb.ObjectID.isValid(req.params._id)
		
			if (validId) {
				const comments = await Collections.loadCommentsCollection()
				let retrievedData = await comments.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)
				
				// If Data Retrieved Store //
				if (retrievedData) { req.retrievedData = retrievedData }
				else { retrievedData = '' }
				
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
}


// [COMMENTS] //
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


// [EXPORT] //
module.exports = CommentsCollection