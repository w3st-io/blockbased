class Auth {
	/******************* [ADMIN] *******************/
	static app() {
		return (req, res, next) => {
			console.log('UNIVERSAL')
			next()
		}
	}
}


// [EXPORT] //
module.exports = Auth
