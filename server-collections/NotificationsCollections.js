/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% NOTIFICATIONS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class NotificationsCollection {
	/******************* [CRUD] *******************/
	// [READ-ALL] //
	static async readAll() {}


	// [DELETE] //
	static async delete() {}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance() {}


	// [OWNERSHIP] //
	static async ownership() {}


	/******************* [COUNT] *******************/
	static async count() {}
}


// [EXPORT] //
module.exports = NotificationsCollection
