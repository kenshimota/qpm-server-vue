import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Buefy from 'buefy';
import { isLogin } from './utils/qpm';
import 'buefy/dist/buefy.css';
import '@mdi/font/css/materialdesignicons.css';
import 'moment/locale/es';
import './styles/main.css';

Vue.use(Buefy);
Vue.config.productionTip = false;

/* validancion de la session actual */
router.beforeEach(function(to, from, next) {
  if (to.fullPath != '/login' && to.fullPath != '/language' && !isLogin())
    return next({ path: '/login' });
  else next();
});

new Vue({ 
	router, 
	render: h => h(App)
}).$mount('#app');
