import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import { Message,Button,Input,Empty,MessageBox } from 'element-ui';
import GoEasy from 'goeasy'

Vue.use(Button);
Vue.use(Input);
Vue.use(Empty);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;

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

