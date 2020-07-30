/**
 * %%%%%%%%%%%% *
 * %%% MAIN %%% *
 * %%%%%%%%%%%% *
 */
// [IMPORT] //
import Vue from 'vue'
import vueHeadful from 'vue-headful'
import { ValidationObserver, ValidationProvider } from 'vee-validate'


// [IMPORT] Personal //
import '@assets/styles/bootstrap-override.scss'
import '@assets/styles/style.scss'
import './stuff-n-rules'
import App from './App.vue'
import router from '@router'


// [USE] //


// [GLOBAL COMPONENTS] //
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('vue-headful', vueHeadful)


// [EXPORT] Event Bus //
export const EventBus = new Vue()


// [CONFIG + RENDER] //
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')