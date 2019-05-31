// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from './router';
import App from './App'
import 'assets/js/rem';

Vue.config.productionTip = false;

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  const type = to.meta.type
  // 判断该路由是否需要登录权限
  if (type === 'login') {
    if (window.localStorage.getItem('token') && window.localStorage.getItem('user')) {
      next()
    } else {
      next('/alogin')
    }
  } else {
    next()  // 确保一定要有next()被调用
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
