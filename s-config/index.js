/**
 * %%%%%%%%%%%%%%
 * %%% CONFIG %%%
 * %%%%%%%%%%%%%%
*/
// [REQUIRE] //
require('dotenv').config()


// [EXPORT] //
module.exports = {
	// [URL + PORT] //
	BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
	SOCKET_BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
	PORT: process.env.PORT || 5000,
	
	// [MONGODB] //
	MONG_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/blockbased',
	
	// [EMAIL] //
	EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	EMAIL_SERVICE: process.env.EMAIL_SERVICE,
	
	// [SECRET] //
	SECRET_KEY: process.env.SECRET_KEY || 'secret',
}