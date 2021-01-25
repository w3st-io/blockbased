module.exports = {
	presets: [
		'@vue/cli-plugin-babel/preset'
	],
	plugins: [
		['module-resolver', {
			alias: {
            root: ['./'],
				'@': './',
				'@node_modules': './node_modules',
				'@defaults': './src/defaults',
				'@assets': './src/assets',
				'@components': './src/components',
				'@main': './src/main',
				'@pages': './src/pages',
				'@router': './src/router',
				'@services': './src/services',
				'@utils': './src/utils',
			}
		}]
	]	
}