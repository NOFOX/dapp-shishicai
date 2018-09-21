// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import E404 from './components/E404'
import How from './components/How'
import Link from './components/Link'
import About from './components/About'
import History from './components/History'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './base.css' /*引入公共样式*/
import i18n from './i18n'
import './getblock.js'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.config.productionTip = false
// router

const routes = [
  { path: '/',template:"<App />", component: App },
  { path: '/how',template:"<How />", component: How },
  { path: '/history',template:"<History />", component: History },
  { path: '/link',template:"<Link />", component: Link },
  { path: '/link/:player',template:"<App />", component: App },
  { path: '/about',template:"<About />", component: About },
  { path: '*',template:"<E404 />", component: E404 },
]
const router = new VueRouter({
  mode: 'history',
  routes // like routes: routes
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router
})



// WEBPACK FOOTER //
// ./src/main.js