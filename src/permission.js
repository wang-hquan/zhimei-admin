import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import {checkLoginState} from '@/api/login'

const whiteList = ['/login','/']; // 不重定向白名单

router.beforeEach ((to, from, next) => {
  NProgress.start();
  checkLoginState().then(res => {
      let {code, msg, data} = res;
      let user = JSON.parse(sessionStorage.getItem('user'));
      if (user && code == 200) {
          if (to.path === '/login') {
            next({path: '/'});
            NProgress.done();
          } else {
            next();
          }
      } else {
          sessionStorage.removeItem('user');
          if (whiteList.indexOf(to.path) !== -1) {
            next()
          } else {
            next('/login');
            NProgress.done();
          }
      }
  });
});

router.afterEach(() => {
  NProgress.done() // 结束Progress
});
