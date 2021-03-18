import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// new Vue 创建一个 vue 实例，其实就是一个 vue 组件，这个组件就是根组件，是属于 vue 内所有组件的祖先，也就是其他组件 (App Home About) 都会继承该组件
// new Vue 传递的参数其实可以使用组件 this.$options 获取
// 先明白 Vue 里面有 router 会对 Vue 产生什么影响，会改变什么
// main.js 内引入了 router, 那么所有组件内都有 $router 和 $route,$router 指的是 VueRouter 类, $route 是指 路由跳转的地址信息等
// 所有组件都触发,给所有组件(除了根组件) 添加 $router 属性,给根组件的 $options 内添加 router 属性,属性值都是创建好的 路由实例
// Vue.prototype.$router = VueRouter; 不使用，添加了也没有用
new Vue({
  router,
  // 给组件添加一些路由
  render: h => h(App)
}).$mount('#app')



 