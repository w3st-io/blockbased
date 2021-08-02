// [IMPORT] //
import io from 'socket.io-client'
import Vue from 'vue'
import Vuex from 'vuex'


// [USE] //
Vue.use(Vuex)


export default new Vuex.Store({
	state: {
		node_env: localStorage.node_env == 'development' ? 'development' : 'production',

		showIntro: true,
		loading: false,

		showMenu: false,

		userLogged: false,
		user_decoded: {},
		
		adminLogged: false,
		admin_decoded: {},

		iexKey: '',
		iexSBKey: '',
		
		socket:
			localStorage.node_env == 'development' ? io('http://localhost:5000') : io()
	},

	// Syncrous //
	mutations: {
		isLoading(state) { state.loading = true },

		isNotLoading(state) { state.loading = false },
	},

	// Asyncronous //
	actions: {},

	getters: {},
	
	modules: {},
});
