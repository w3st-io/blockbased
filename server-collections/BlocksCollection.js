/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
require('dotenv').config()


class BlocksCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static create() {
		return async (req, res, next) => {
			const blocks = await loadBlocksCollection()
			await blocks.insertOne({
				createdAt: new Date(),
				cat_id: req.body.cat_id,
				title: req.body.title,
				voters: [],
				followers: [],
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


	// [READ ALL] Within Cat //
	static readAll() {
		return async (req, res, next) => {
			let skip = parseInt(req.params.skip)
			let amountPerPage = parseInt(req.params.amountPerPage)
			
			const blocks = await loadBlocksCollection()
			const retrievedData = await blocks.find({ cat_id: req.params.cat_id })
				.skip(skip)
				.limit(amountPerPage)
				.toArray()

			// If Data Retrieved Store //
			if (retrievedData) { req.retrievedData = retrievedData }
			else { req.retrievedData = '' }
			
			next()
		}
	}


	// [READ] Single Block //
	static read() {
		return async (req, res, next) => {
			let validId = mongodb.ObjectID.isValid(req.params.block_id)
		
			if (validId) {
				const blocks = await loadBlocksCollection()
				const retrievedData = await blocks.findOne(
					{ _id: new mongodb.ObjectID(req.params.block_id) }
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

	// [DELETE] //
	static delete() {
		return async (req, res, next) => {
			/*const blocks = await loadBlocksCollection()
			await blocks.deleteOne({
				_id: new mongodb.ObjectID(req.params.block_id),
				user_id: req.decoded._id,
			})*/

			next()
		}
	}


	/******************* [VOTE SYSTEM] *******************/
	static pushVoter() {
		return async (req, res, next) => {
			const blocks = await loadBlocksCollection()
			await blocks.updateOne(
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
			const blocks = await loadBlocksCollection()
			await blocks.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ $pull: { voters: { user_id: req.decoded._id } } },
				{ upsert: true }
			)
				.then( next() )
				.catch( res.status(400) )
		}
	}


	// Check if User Voted For This Block
	static checkForVote() { next() }


	/******************* [VALIDATE] *******************/
	// Check Block Exists //
	static validate() {
		return async (req, res, next) => {
			if (mongodb.ObjectID.isValid(req.params._id)) {
				const blocks = await loadBlocksCollection()
				const retrievedData = await blocks.findOne(
					{ _id: new mongodb.ObjectID(req.params._id) }
				)

				if (retrievedData) { next() }
				else { res.status(201).send(false) }
			}
			else {
				res.status(400).send({
					auth: true,
					message: 'Invalid Block Id.'
				})
			}
		}
	}


	// Verify Ownership //
	static verifyOwnership() {
		return async (req, res, next) => { next() }
	}


	/******************* [COUNT] *******************/
	static count() {
		return async (req, res, next) => {
			const blocks = await loadBlocksCollection()
			const count = await blocks.countDocuments(
				{ cat_id: req.params.cat_id }
			)

			if (count) { req.count = count }
			else { req.count = 0 }

			next()
		}
	}
}


// [LOAD COLLECTION] //
async function loadBlocksCollection() {
	const uri = process.env.MONGO_URI
	const db_name = process.env.DB || 'db_name'
	const c_name = 'blocks'

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
module.exports = BlocksCollection
