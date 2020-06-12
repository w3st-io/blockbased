module.exports = {
	publicPath: '',
	devServer: {
		proxy: {
			'^/users': {
				target: 'http://localhost:5000',
				ws: true,
				changeOrigin: true
			},
			'^/api': {
				target: 'http://localhost:5000',
				ws: true,
				changeOrigin: true
			}
		}
	}
}