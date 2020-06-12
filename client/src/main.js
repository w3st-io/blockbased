/**
 * %%%%%%%%%%%% *
 * %%% MAIN %%% *
 * %%%%%%%%%%%% *
 * This page is the main component that is runbundleRenderer.
 * here you have the global imports and the global components
 * that are going to be used throughout the application.
 */
// [IMPORT] //
import 'bootstrap/dist/css/bootstrap.css'
import CKEditor from '@ckeditor/ckeditor5-vue';
import Vue from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

// [IMPORT] Personal //
import '@assets/styles/bootstrap-override.scss'
import '@assets/styles/style.scss'
import './stuff-n-rules'
import App from './App.vue'
import router from '@router'

// [USE] //
Vue.use(CKEditor)

// [GLOBAL COMPONENTS] //
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