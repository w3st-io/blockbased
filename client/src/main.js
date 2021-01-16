/**
 * %%%%%%%%%%%%
 * %%% MAIN %%%
 * %%%%%%%%%%%%
*/
// [IMPORT] //
import Vue from 'vue'
import VueHeadful from 'vue-headful'
import { BootstrapVue } from 'bootstrap-vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// [IMPORT] Personal //
import App from './App.vue'
import router from '@router'
import '@assets/styles/bootstrap-override.scss'
import '@assets/styles/style.scss'
import './vee-validation-rules'


// [VUE-USE] //
Vue.use(BootstrapVue)


// [GLOBAL COMPONENTS] //
Vue.component('VueHeadful', VueHeadful)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)


// [EXPORT] Event Bus //
export const EventBus = new Vue()


// [CONFIG + RENDER] //
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')