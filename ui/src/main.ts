import Vue from 'vue';
import App from './App.vue';
// @ts-ignore
import VueMaterial from 'vue-material'
import router from './router';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'

Vue.config.productionTip = false;

Vue.use(VueMaterial)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
