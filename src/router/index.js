import Vue from 'vue';
import VueRouter from 'vue-router';
import { getLocalStorageItemWithExpiration } from '../utils/utils';
const Home = () => import('@/views/Home.vue');
const Login = () => import('@/views/Login.vue');
const SignUp = () => import('@/views/SignUp.vue');
const Conversations = () => import('@/views/Conversations.vue');
const Contacts = () => import('@/views/Contacts.vue');
const PrivateChat = () => import('@/views/PrivateChat.vue');
const GroupChat = () => import('@/views/GroupChat.vue');
const NewChat = () => import('@/views/NewChat.vue');
const ChatZone = () => import('@/views/ChatZone.vue');
Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home,
        redirect: '/conversations',
        children: [
            {
                path: '/conversations',
	            component: Conversations,

                children: [
                    {
                        path: 'privatechat/:id',
                        component: PrivateChat,
                    },
                    {
                        path: 'groupchat/:id',
	                    component: GroupChat,
                    },
                ],
                meta:{
                    keepAlive: true
                }
            },
            {
                path: '/contacts',
	            component: Contacts,
            },
            {
                path: '/newchat',
	            component: NewChat,
            },
            {
                path: '/chatzone',
	            component: ChatZone,
            },
        ],
    },
    {
        path: '/login',
	    component: Login,
    },
    {
        path: '/signup',
	    component: SignUp,
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach((to, from, next) => {
    let currentUser = getLocalStorageItemWithExpiration('currentUser');
    if(!currentUser){
        if ((to.path !== '/login' && to.path !== '/signup')) {
            next({path: '/login'})
        } else next()
    }
    else {
        Vue.prototype.globalData.currentUser = JSON.parse(currentUser);
        next()
    }
})

export default router;
