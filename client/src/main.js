/**
 * %%%%%%%%%%%% *
 * %%% MAIN %%% *
 * %%%%%%%%%%%% *
 * This page is the main component that is runbundleRenderer.
 * here you have the global imports and the global components
 * that are going to be used throughout the application.
 */
/*** [IMPORT] ***/
import 'bootstrap/dist/css/bootstrap.css'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import Vue from 'vue'

/*** [IMPORT] Personal ***/
import './assets/styles/custom.css'
import './assets/styles/style.css'
import './stuff-n-rules'
import App from './App.vue'
import router from './router'

/*** [GLOBAL COMPONENTS] ***/
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

/*** [EXPORT] Event Bus ***/
export const EventBus = new Vue()

/*** [CONFIG + RENDER] ***/
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')