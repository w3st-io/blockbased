module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	],
	plugins: [
		["module-resolver", {
			alias: {
            root: ['./'],
				'@': './',
				'@defaults': './defaults',
				'@assets': './src/assets',
				'@components': './src/components',
				'@main': './src/main',
				'@pages': './src/pages',
				'@router': './src/router',
				'@services': './src/services'
			}
		}]
	]	
}
