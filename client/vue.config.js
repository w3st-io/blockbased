// [REQUIRE] Personal //
require('dotenv').config()


// [INIT] //
const port = process.env.PORT || 5000


// [EXPORT] //
module.exports = {
	publicPath: '/',
	devServer: {
		proxy: {
			'^/api': {
				target: `http://localhost:${port}`,
				ws: true,
				changeOrigin: true
			},
			'^/pages': {
				target: `http://localhost:${port}`,
				ws: true,
				changeOrigin: true
			}
		}
	}
}