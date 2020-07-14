/**
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
 * %%% REPORTS COLLECTION %%% *
 * %%%%%%%%%%%%%%%%%%%%%%%%%% *
*/
// [REQUIRE] //
const mongoose = require('mongoose')
require('dotenv').config()


// [MONGOOSE CONNECT] //
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})


class ReportsCollection {
	/******************* [CRRUD] *******************/
	// [READ ALL] //
	static async readAll(req) {}


	// [DELETE] //
	static async delete(req) {}


	/******************* [EXISTANCE + OWNERSHIP] *******************/
	// [EXISTANCE] //
	static async existance(_id) {}


	// [OWNERSHIP] //
	static async ownership(req) {}


	/******************* [COUNT] *******************/
	static async count(req) {}
}


// [EXPORT] //
module.exports = ReportsCollection
