/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongodb = require('mongodb')
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const BlockModel = require('../models/BlockModel')

// [INIT] //
const uri = process.env.MONGO_URI
const db_name = process.env.DB || 'db_name'
const c_name = 'blocks'

// [LOAD COLLECTION] blocks //
const loadBlocksCollection = async () => {
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
mongoose.connect(
	uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
)


class BlocksCollection {
	static async create2(req) {
		const blockModel = new BlockModel({
			_id: mongoose.Types.ObjectId(),
			user: req.decoded._id,
			email: req.decoded.email,
			username: req.decoded.username,
			cat_id: req.body.cat_id,
			title: req.body.title,
		})
		blockModel.save()
	}
	
	/******************* [CRRUD] *******************/
	// [CREATE] //
	static async create(req) {
		try {
			const formData = new BlockModel({
					createdAt: new Date(),
					user_id: new mongodb.ObjectID(req.decoded._id),
					email: req.decoded.email,
					username: req.decoded.username,
					cat_id: req.body.cat_id,
					title: req.body.title,
			})
			
			formData.save()

			return 'Created block.'
		}
		catch(e) { return `Caught Error: ${e}`	}
	}


	// [READ ALL] //
	static async readAllAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const returnedData = await BlockModel.find()
				.skip(skip)
				.limit(amount)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.exec()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ ALL] Within Cat //
	static async readAll(req) {
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const returnedData = await BlockModel.find(
				{ cat_id: req.params.cat_id }
			)
				.skip(skip)
				.limit(amount)
				.populate(
					'user',
					'first_name last_name username email profileImg'
				)
				.exec()

			return returnedData
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [READ] Single Block //
	static async read(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)
	
		if (validId) {
			try {
				const returnedData = await BlockModel
					.findById(req.params._id)
					.populate(
						'user',
						'first_name last_name username email profileImg'
					)
					.exec()
				
				return returnedData
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [DELETE] //
	static async delete(req) {
		const validId = mongodb.ObjectID.isValid(req.params._id)

		if (validId) {
			try {
				await BlockModel.findByIdAndDelete(
					req.params._id,
					function (e, block) {
						if (e) { return (e) }
						else { return `Deleted: ${block}` }
					}
				)
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	/******************* [VOTE SYSTEM] *******************/
	static async like(req) {
		try {
			await BlockModel.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ '$addToSet': { 
					'likers': { 'user_id': new mongodb.ObjectID(req.decoded._id) }
				} }
		  )

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	static async unlike(req) {
		try {
			await BlockModel.updateOne(
				{ _id: new mongodb.ObjectID(req.params._id) },
				{ '$pull': { 
					'likers': { 'user_id': new mongodb.ObjectID(req.decoded._id) }
				} }
		  )
		}
		catch(e) { return `Caught Error: ${e}` }
	}

	static async likeExistance(req) { return true }

	// Check if User Liked For This Block
	static async checkForLike(req) { return }


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(_id) {
		if (mongodb.ObjectID.isValid(_id)) {
			try {
				const blocks = await loadBlocksCollection()
				const returnedData = await blocks.findOne(
					{ _id: new mongodb.ObjectID(_id) }
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
			console.log(req.decoded._id)
			try {	
				const returnedData = await BlockModel.findOne(
					{
						_id: new mongodb.ObjectID(req.params._id),
						user: new mongodb.ObjectID(req.decoded._id),
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
			const count = await BlockModel.countDocuments(
				{ cat_id: req.params.cat_id }
			)

			return count
		}
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = BlocksCollection
