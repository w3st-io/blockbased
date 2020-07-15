/**
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% BLOCKS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [REQUIRE] //
const BlockModel = require('../server-models/BlockModel')


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class BlocksCollection {
	/******************* [CRUD] *******************/
	// [CREATE] //
	static async create(req) {
		const formData = new BlockModel({
			_id: mongoose.Types.ObjectId(),
			user: req.decoded._id,
			cat_id: req.body.cat_id,
			title: req.body.title,
		})

		try { await formData.save() }
		catch(e) { return `Caught Error: ${e}` }

		return 'Created block.'
	}


	// [READ-ALL-ALL] //
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


	// [READ-ALL] Within Cat //
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
		const validId = mongoose.isValidObjectId(req.params._id)
	
		if (validId) {
			try {
				const returnedData = await BlockModel.findById(req.params._id)
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
		const validId = mongoose.isValidObjectId(req.params._id)

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
				{ _id: mongoose.Types.ObjectId(req.params._id) },
				{ '$addToSet': { 
					'likers': { 'user_id': mongoose.Types.ObjectId(req.decoded._id) }
				} }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	static async unlike(req) {
		try {
			await BlockModel.updateOne(
				{ _id: mongoose.Types.ObjectId(req.params._id) },
				{ '$pull': { 
					'likers': { 'user_id': mongoose.Types.ObjectId(req.decoded._id) }
				} }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	static async likeExistance(req) { return true }


	static async checkForLike(req) { return }


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(_id) {
		if (mongoose.isValidObjectId(_id)) {
			try {	
				const returnedData = await BlockModel.findOne({ _id: _id })

				if (returnedData) { return true }
				else { return false }
			}
			catch(e) { return `Caught Error: ${e}` }
		}
		else { return 'Invalid Block ID.' }
	}


	// [OWNERSHIP] //
	static async ownership(req) {
		if (mongoose.isValidObjectId(req.params._id)) {
			try {	
				const returnedData = await BlockModel.findOne(
					{
						_id: req.params._id,
						user: req.decoded._id,
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
