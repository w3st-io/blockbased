/**
 * %%%%%%%%%%%% *
 * %%% MAIN %%% *
 * %%%%%%%%%%%% *
*/
// [IMPORT] //
import Vue from 'vue'
import vueHeadful from 'vue-headful'
import { BootstrapVue } from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// [IMPORT] Personal //
import '@assets/styles/bootstrap-override.scss'
import '@assets/styles/style.scss'
import './stuff-n-rules'
import App from './App.vue'
import router from '@router'


// [VUE-USE] //
Vue.use(BootstrapVue)


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