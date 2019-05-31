import App from '../App'
const index = r => require.ensure([], () => r(require('pages/index')), 'index') // 首页
const message = r => require.ensure([], () => r(require('pages/message')), 'message') // 支付信息
const detail = r => require.ensure([], () => r(require('pages/detail')), 'detail') // 详情
const modify = r => require.ensure([], () => r(require('pages/modify')), 'modify') // 修改密码
const exhibition = r => require.ensure([], () => r(require('pages/exhibition')), 'exhibition') // 页面展示
const admin = r => require.ensure([], () => r(require('pages/admin')), 'admin') // 后台首页
const alogin = r => require.ensure([], () => r(require('pages/alogin')), 'alogin') // 后台登录
const alist = r => require.ensure([], () => r(require('pages/alist')), 'alist') // 后台登录
const aorder = r => require.ensure([], () => r(require('pages/aorder')), 'aorder') // 后台订单
const acollent = r => require.ensure([], () => r(require('pages/acollent')), 'acollent') // 后台汇总查询
const arecord = r => require.ensure([], () => r(require('pages/arecord')), 'arecord') // 后台补货几率
const awraning = r => require.ensure([], () => r(require('pages/awraning')), 'awraning') // 后台警示
const auser = r => require.ensure([], () => r(require('pages/auser')), 'auser') // 后台用户管理
const toggle = r => require.ensure([], () => r(require('pages/toggle')), 'toggle') // 后台用户管理
const aadduser = r => require.ensure([], () => r(require('pages/aadduser')), 'aadduser') // 后台添加账户
const afacility = r => require.ensure([], () => r(require('pages/afacility')), 'afacility') // 后台管理设备
const asetname = r => require.ensure([], () => r(require('pages/asetname')), 'asetname') // 后台修改设备名称
const alistdetail = r => require.ensure([], () => r(require('pages/alistdetail')), 'alistdetail') // 后台类表详情


const routes = [
  {
    path: '/',
    component: App,
    meta: {
      keepAlive: true,
    },
    children: [
      {
        path: '',
        redirect: '/index',
        meta: {
        }
      },
      {
        path: '/index',
        component: index,
        meta: {
          title: '无人超市',
          index: 1
        }
      },
      {
        path: '/detail/:id',
        component: detail,
        meta: {
          title: '详情',
          index: 2
        }
      },
      {
        path: '/modify',
        component: modify,
        meta: {
          title: '修改密码',
        }
      },
      {
        path: '/message',
        name:　'message',
        component: message,
        meta: {
          title: '留言'
        }
      },
      {
        path: '/admin',
        component: admin,
        meta: {
          title: '无人超市后台',
          type: 'login'
        }
      },
      {
        path: '/alogin',
        component: alogin,
        meta: {
          title: '无人超市后台',
          type: ''
        }
      },
      {
        path: '/alist',
        component: alist,
        meta: {
          title: '补货窗口',
          // type: 'login'
        }
      },
      {
        path: '/aorder',
        component: aorder,
        meta: {
          title: '订单',
          // type: 'login'
        }
      },
      {
        path: '/acollent',
        component: acollent,
        meta: {
          title: '汇总查询',
          // type: 'login'
        }
      },
      {
        path: '/arecord',
        component: arecord,
        meta: {
          title: '补货几率',
          // type: 'login'
        }
      },
      {
        path: '/awraning',
        component: awraning,
        meta: {
          title: '警示',
          // type: 'login'
        }
      },
      {
        name: 'toggle',
        path: '/toggle',
        component: toggle,
        meta: {
          title: '界面管理',
          // type: 'login'
        }
      },
      {
        name: 'exhibition',
        path: '/exhibition',
        component: exhibition,
        meta: {
          title: '界面展示',
          // type: 'login'
        }
      },
      {
        path: '/auser',
        component: auser,
        meta: {
          title: '账户管理',
          // type: 'login'
        }
      },
      {
        path: '/aadduser',
        component: aadduser,
        meta: {
          title: '添加账户',
          // type: 'login'
        }
      },
      {
        path: '/afacility',
        component: afacility,
        meta: {
          title: '设备管理',
          // type: 'login'
        }
      },
      {
        path: '/asetname',
        component: asetname,
        meta: {
          title: '修改设备名称',
          // type: 'login'
        }
      },
      {
        path: '/alistdetail/:name',
        component: alistdetail,
        meta: {
          title: '详情',
          // type: 'login'
        }
      }
    ]
  }
]

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
	scrollBehavior (to, from, savedPosition) {
    if (to.meta.title) {
      document.title = to.meta.title
    }
  }
})

export default router;