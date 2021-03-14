// [REQUIRE] //
require('dotenv').config()


// [EXPORT] //
module.exports = {
	// [APP] //
	NODE_ENV: process.env.NODE_ENV || 'development',

	// [FUNCTIONALITY] //
	ADMIN_FUNCTIONALITY: process.env.ADMIN_FUNCTIONALITY || false,
	USER_FUNCTIONALITY: process.env.USER_FUNCTIONALITY || false,
	PAYMENT_FUNCTIONALITY: process.env.PAYMENT_FUNCTIONALITY || false,
	POST_FUNCTIONALITY: process.env.POST_FUNCTIONALITY || false,
	COMMENT_FUNCTIONALITY: process.env.COMMENT_FUNCTIONALITY || false,

	// [URL] //
	CLIENT_BASE_URL: process.env.BASE_URL || 'http://localhost:8080',
	SERVER_BASE_URL: process.env.BASE_URL || 'http://localhost:5000',

	// [PORT] //
	PORT: process.env.PORT || 5000,
	
	// [MONGODB] //
	MONG_URI: process.env.MONGO_URI || '',
	
	// [EMAIL] //
	EMAIL: process.env.EMAIL || '',
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
	EMAIL_SERVICE: process.env.EMAIL_SERVICE || '',

	// [EMAIL-RECEIVERS] //
	ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
	ADVANCED_EMAIL: process.env.ADVANCED_EMAIL || '',
	DESIGNS_EMAIL: process.env.DESIGNS_EMAIL || '',
	INSTALLS_EMAIL: process.env.INSTALLS_EMAIL || '',
	SERVICES_EMAIL: process.env.SERVICES_EMAIL || '',
	
	// [SECRET] //
	SECRET_KEY: process.env.SECRET_KEY || 'secret',

	// [IEX] //
	IEX_PUBLIC_KEY: process.env.IEX_PUBLIC_KEY || '',
	IEX_SB_PUBLIC_KEY: process.env.IEX_SB_PUBLIC_KEY || '',
}