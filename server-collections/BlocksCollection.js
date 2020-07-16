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
		const user_id = req.decoded._id
		const cat_id = req.body.cat_id
		const title = req.body.title

		const formData = new BlockModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			cat_id: cat_id,
			title: title,
		})

		try { await formData.save() }
		catch(e) {
			return {
				status: false,
				user: user_id,
				cat_id: cat_id,
				title: title,
				message: `Caught Error --> ${e}`,
			}
		}

		return {
			status: true,
			user: user_id,
			cat_id: cat_id,
			title: title,
			message: 'Created block.',
		}
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
		catch(e) {
			return {
				status: false,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ-ALL] Within Cat //
	static async readAll(req) {
		const cat_id = req.params.cat_id
		const skip = parseInt(req.params.skip)
		const amount = parseInt(req.params.amount)

		try {
			const returnedData = await BlockModel.find(
				{ cat_id: cat_id }
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
		catch(e) {
			return {
				status: false,
				cat_id: cat_id,
				message: `Caught Error --> ${e}`,
			}
		}
	}


	// [READ] Single Block //
	static async read(req) {
		const block_id = req.params._id
		const validId = mongoose.isValidObjectId(req.params._id)
	
		if (validId) {
			try {
				const returnedData = await BlockModel.findById(block_id)
					.populate(
						'user',
						'first_name last_name username email profileImg'
					)
					.exec()
				
				return returnedData
			}
			catch(e) {
				return {
					status: false,
					block_id: block_id,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				block_id: block_id,
				message: 'Invalid Block ID.',
			}
		}
	}


	// [DELETE] //
	static async delete(req) {
		const block_id = req.params._id
		const validId = mongoose.isValidObjectId(req.params._id)

		if (validId) {
			try {
				await BlockModel.findByIdAndDelete(
					block_id,
					function (e, block) {
						if (e) { return e }
						else { return `Deleted: ${block}` }
					}
				)
			}
			catch(e) {
				return {
					status: false,
					block_id: block_id,
					message: `Caught Error --> ${e}`,
				}
			}
		}
		else {
			return {
				status: false,
				block_id: block_id,
				message: 'Invalid Block ID.',
			}
		}
	}


	/******************* [VOTE SYSTEM] *******************/
	// [LIKE] //
	static async like(req) {
		try {
			await BlockModel.updateOne(
				{ _id: req.params._id },
				{ '$addToSet': { 
					'likers': req.decoded._id
				} }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [UNLIKE] //
	static async unlike(req) {
		try {
			await BlockModel.updateOne(
				{ _id: req.params._id },
				{ '$pull': { 
					'likers': req.decoded._id
				} }
			)

			return
		}
		catch(e) { return `Caught Error: ${e}` }
	}


	// [LIKE-EXISTANCE] //
	static async likeExistance(req) { return true }


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(block_id) {
		if (mongoose.isValidObjectId(block_id)) {
			try {	
				const returnedData = await BlockModel.findOne({ _id: block_id })

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
		try { return await BlockModel.countDocuments({ cat_id: req.params.cat_id }) }
		catch(e) { return `Caught Error: ${e}` }
	}
}


// [EXPORT] //
module.exports = BlocksCollection
