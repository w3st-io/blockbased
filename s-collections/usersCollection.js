// [REQUIRE] //
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const UserModel = require('../s-models/UserModel')


module.exports = {
	/******************* [CRUD] *******************/
	c_read: async (_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(_id)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid _id'
				}
			}
		
			const user = await UserModel.findOne({ _id })
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	},


	// [UPDATE] Profile Picture //
	c_update: async ({ user_id, img_url, bio }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
	
			// [VALIDATE] img_url //
			if (!validator.isURL(img_url)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid URL (Must be URL)'
				}
			}
	
			// [VALIDATE] bio //
			if (bio.includes('<script') || bio.includes('</script>')) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: XSS not aloud',
				}
			}
	
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{
					$set: {
						profile_img: img_url,
						bio: bio,
					}
				}
			)
	
			return {
				executed: true,
				status: true,
				message: 'Updated profile',
				updatedUser: updatedUser
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [CREATE] User (with password) //
	c_register: async ({ username, email, password }) => {
		try {
			// [VALIDATE] username //
			if (!validator.isAscii(username)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid username'
				}
			}
	
			// [VALIDATE] email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid email'
				}
			}
	
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid password'
				}
			}
	
			// Username Check //
			if (await UserModel.findOne({ username })) {
				return {
					executed: true,
					status: true,
					message: 'That username is taken',
					created: false,
				}
			}
	
			// Email Check //
			if (await UserModel.findOne({ email })) {
				return {
					executed: true,
					status: true,
					message: 'That email is already registered',
					created: false,
				}
			}
	
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid password',
					created: false,
				}
			}
	
			// [ENCRYPT] Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
	
			// [SAVE] //
			const user = await new UserModel({
				_id: mongoose.Types.ObjectId(),
				username,
				email,
				password: hashedPassword,
			}).save()
			
			return {
				executed: true,
				status: true,
				message: 'Successfully created account',
				created: true,
				user: user,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`,
				created: false,
			}
		}
	},


	// [READ-ALL] Sorted (No password) //
	c_readAllSorted: async ({ sort = 0, limit, skip }) => {
		try {
			// [SANTIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid sort',
				}
			}
	
			// [VALDIATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = {} }
			else if (sort == 1) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Unknown filter'
				}
			}
	
	
			const users = await UserModel.find()
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.select('-password')
				.exec()
			
			return {
				executed: true,
				status: true,
				users: users
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	// [READ-ALL] Sorted (No password) //
	c_readSelect: async ({ user_id, select = undefined }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
	
			// [VALIDATE] user_id //
			if (select != undefined && !validator.isAscii(select)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid select'
				}
			}
		
			const user = await UserModel.findOne({ _id: user_id }).select(select)
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	c_readByEmail: async (email) => {
		try {
			// [VALIDATE] user_id //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid email'
				}
			}
		
			const user = await UserModel.findOne({ email })
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	},


	c_getIdByEmail: async (email) => {
		try {
			// [VALIDATE] Email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid email'
				}
			}
	
			const user = await UserModel.findOne({ email })
	
			if (!user) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: No user found'
				}
			}
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	c_updatePassword: async (user_id, password) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
			
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid password'
				}
			}
	
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: 'Invalid password (8 < password < 50)',
				}
			}
		
			// Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
			
			// [UPDATE] Password for User //
			const user = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { password: hashedPassword } }
			)
	
			return {
				executed: true,
				status: true,
				message: 'UserCollection: Updated password',
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	},


	/******************* [FUZZY-SEARCH] *******************/
	c_fuzzySearch: async (user_id, query) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
			
			// [VALIDATE] post_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid query',
					existance: false,
				}
			}
	
			// [INIT] //
			let exactMatch = []
	
			// [READ] //
			const users = await UserModel.fuzzySearch({ query: query })
				.select('-password')
				.exec()
			
			// [EXACT-MATCH] //
			exactMatch = await UserModel.find({ email: query })
				.select('-password')
				.exec()
	
			if (exactMatch.length == 0) {
				exactMatch = await UserModel.find({ username: query })
					.select('-password')
					.exec()
			}
	
			if (users.length == 0 && exactMatch.length == 1) {
				users.push(exactMatch[0])
			}
	
			return {
				executed: true,
				status: true,
				users: users,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`,
				existance: false,
			}
		}
	},


	c_fuzzySearchCount: async (query) => {
		try {
			// [VALIDATE] post_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'usersCollection: Invalid query',
					existance: false,
				}
			}
			
			// [COUNT] //
			let count = await UserModel.fuzzySearch({ query: query }).countDocuments()
	
			// [EXACT-MATCH] //
			exactMatch = await UserModel.find({ email: query }).countDocuments()
	
			if (exactMatch == 0) {
				exactMatch = await UserModel.find({ username: query }).countDocuments()
			}
	
			if (count == 0 && exactMatch == 1) { count = 1 }
	
			return {
				executed: true,
				status: true,
				count: count,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`,
				existance: false,
			}
		}
	},


	/******************* [VERIFY] *******************/
	c_verify: async (user_id) => {
		try {
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
	
			const user = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { verified: true } }
			)
	
			return {
				executed: true,
				status: true,
				message: 'UserCollection: Verified profile',
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`
			}
		}
	},


	c_verifiedStatus: async (user_id) => {
		try {
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid user_id'
				}
			}
	
			const user = await UserModel.findOne({
				_id: user_id,
				verified: true,
			})
	
			if (user) {
				return {
					executed: true,
					status: true,
					message: 'User verified',
					user: user,
				}
			}
			else {
				return {
					executed: true,
					status: false,
					message: 'User NOT verified',
					user: user,
				}
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `usersCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count: async () => {
		try {
			const count = await UserModel.countDocuments()
	
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
				message: `usersCollection: Error --> ${err}`
			}
		}
	},
}