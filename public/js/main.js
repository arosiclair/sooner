import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Login from './Login.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/login', component: Login }
]
const router = new VueRouter({
  routes,
  mode: 'history'
})

// eslint-disable-next-line no-unused-vars
var vm = new Vue({
  el: '#app',
  render: h => h(App),
  router
})
