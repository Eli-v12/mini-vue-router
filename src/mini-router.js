// 我们自己的 vue-router,创建全局组件 router-link  router-view
// VueRouter 是一个类 必须有一个 install 方法
// main.js 内引入了 router, 那么所有组件内都有 $router 和 $route,$router 指的是 VueRouter 类, $route 是指 路由跳转的地址信息等
// import Home from "./views/Home.vue";
let Vue;

class VueRouter {
  // 这里面只能放实例的方法，不能放 install 方法。函数也可以理解成一个对象
  // constructor 是构造函数 默认会接收 new VueRouter 的时候传过来的参数
  constructor(options) {
    this.options = options;
    // console.log(this.options);
    // console.log(Vue);

    // 1. 调用两个全局组件
    // initComponents();
    this.initComponents();

    // 2. 制作一个路由表 {'/':Home.'/about':About}
    this.routeMap = this.options.routes.reduce((res, item) => {
      res[item.path] = item.component;
      return res;
    }, {});
    // console.log(this.routeMap);
    // 需要展示的组件
    // this.current = null;
    // 由于 current 需要事件修改 所以 router-view 获取不到更新之后的 current, 那么就展示不了页面
    // 我们要将current 做成响应式的数据


    this.currentPath = Vue.observable({ path: "/" });


    // 两个事件
    // 进入页面 onload
    // 页面地址值变化  hashchange
    const self = this;
    window.addEventListener("load", function() {

      // 刷新页面的时候
      const path = window.location.hash;
      console.log(path);
      if (path === "" || path === "#/") {
        window.location.hash = "/";
      } else {
        self.currentPath.path = path.slice(1);
        console.log(self.currentPath.path);
      }


    });
    window.addEventListener("hashchange", function() {


      self.currentPath.path = window.location.hash.slice(1)

      
    });
  }
  // 创建全局的两个组件 <router-link> <router-view></router-view>
  // Vue.component('组件名字',{对象，对象下有render函数}) render 函数要返回一个节点
  initComponents() {
    const self = this;
    Vue.component("router-link", {
      render(h) {
        const { to, tag } = this;
        return <tag href={"/#" + to}>{this.$slots.default}</tag>;
      },
      props: {
        to: {
          type: String,
        },
        tag: {
          type: String,
          default: "a",
        },
      },
    });
    Vue.component("router-view", {
      render(h) {
        return h(self.routeMap[self.currentPath.path]);
      },
    });
  }
}
// install 方法会接受 Vue 类作为参数，那么在这将 Vue 暴露出去，当全局来使用
VueRouter.install = (_Vue) => {
  Vue = _Vue;

  // 给 vue 组件做全局配置,Vue 整个 类添加 $router 属性
  // Vue.prototype.$router = 用户创建的路由;
  // 当再次 new Vue 的时候里面也有了 $router 这个其实是不对的
  // 正确的方法应该使用 混入mixin 添加 $router 属性
  // 每个组件创建一次它就会执行一次
  Vue.mixin({
    beforeCreate() {
      // main.js 导入 router 之后做了以下事情
      // 只有根组件的 $options 内添加了 router 之后所有子组件才添加 $router 属性
      // 在 main.js 中 new Vue 传递的参数其实可以使用组件 this.$options 获取
      // 只会有根组件才会第一个接收 router,如果根组件接收了 router 依次添加 router 。

      // 现在什么都没有做的时候 console.log(this.$router) // undefined 什么都没有
      // 我们要做所有组件都触发,给所有组件(除了根组件) 添加 $router 属性,属性值都是创建好的 路由实例 $router(死记住这句话就行)
      // 1.我要找到所有的组件，处理根组件之外的组件  2. 找到创建好的路由实例 $router
      // this.$options 每个组件都有 但是 this.$options.router 这个属性，因为在 new Vue 的时候添加了，值传给了根组件，并没有传给 App,以及其他组件。

      // this.$options.router 创建好的路由只管记住就行了，因为 router 实例自动放到 $options 方法里面
      // 每一个组件都会有 $options 用于当前 Vue 实例的初始化选项
      // 子组件内可以使用 $parent 获取组件实例
      // 父组件内可以使用 $children 获取所有子组件的实例组成的数组
      if (!this.$options.router) {
        if (this.$parent.$options.router) {
          // App 组件
          this.$router = this.$parent.$options.router;
        } else {
          if (this.$parent.$router) {
            // App 以下的其他组件
            this.$router = this.$parent.$router;
          }
        }
      }
      // 先判断根组件有没有接收 router,接收的话 先给自己 然后一级一级向下传递
      // if(this.$options.router){
      //   this.$router = this.$options.router
      // }else{
      //   this.$router = this.$parent && this.$parent.$router
      // }
    },
  });
};

export default VueRouter;

// 创建类是怎么创建的
// 类:是创建对象的，给组件添加属性，方法，类别。 对象有属性和方法。
// const obj = {

// }
// new Object 是这样创建上面那个对象出来的

class Person {
  // 类自带一个 constructor 方法
  constructor(name, age) {
    // new 的时候自动触发，创建对象的时候默认做的事就是以下的事
    this.name = name;
    this.age = age;
    // 这样对象一上来就做好了
  }
  // 看不到 say() 方法，say()是属于公共的方法，是方法原型里面
  //Person 的原型方法 __proto__: 指向 Object 的方法。 里面存着对象的公有方法 有 constructor 和 say
  say() {
    console.log("我是" + this.name);
  }
}
const YY = new Person("小红", "18");
// console.log(YY); // Person {name: "小红", age: "18"}
// YY.say()  // 我是小红

// 继承：继承上面创建好的那个类里面的内容
class Girl extends Person {
  // 先声明 constructor 并且要接收上面传的参数
  constructor(name, age) {
    // super 相当于传给了 Penson 了
    super(name, age);
  }
}

const WW = new Girl("小五", 22);
// console.log(WW); //Girl 的原型方法指向 __proto__: Person 的实例

// 总的来说只要是对象都是底层 Object 创建的。
