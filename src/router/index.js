// 该文件是用户引入我自己创建的 mini-router ,进行各种配置
import Vue from "vue";
// 这是我自己创建的配置文件
// import VueRouter from 'vue-router'
import VueRouter from "../mini-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

// Vue.use 就是执行了 VueRouter 的 install 方法
// use  方法就是把 Vue 自己作为参数传给了 VueRouter 使用，mini-router.js 那边的 VueRouter.install 接收 Vue 作为参数作为全局去使用。
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: () => import("../views/About.vue"),
  // },
];

// new VueRouter 传参，class VueRouter 那边怎么接收呢：
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,  // base: "/"
  routes,  // routes: Array(2)
});

export default router;
