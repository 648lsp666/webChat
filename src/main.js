import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import ElementUI from 'element-ui';
import '@icon-park/vue/styles/index.css'
import 'element-ui/lib/theme-chalk/index.css';
import GoEasy from 'goeasy'

Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.globalData = {
    currentUser: null
};

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');

const goEasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io', //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
    appkey: 'BC-ac59284332334d4c98b0cc26177d2897', // common key,
    modules: ['im'],
});

Vue.prototype.GoEasy = GoEasy;
Vue.prototype.goEasy = goEasy;

