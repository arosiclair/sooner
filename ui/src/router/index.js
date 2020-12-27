import Vue from 'vue'
import VueRouter from 'vue-router'
import List from '../components/List'

export const RouteNames = {
  List: 'List',
  Login: 'Login',
  PasswordReset: 'PasswordReset',
  PasswordResetSuccess: 'PasswordResetSuccess'
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/list',
    name: RouteNames.List,
    component: List
  },
  {
    path: '/login',
    name: RouteNames.Login,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/passwordReset',
    name: RouteNames.PasswordReset,
    component: () => import(/* webpackChunkName: "passwordreset" */ '../components/PasswordReset/PasswordReset')
  },
  {
    path: '/passwordReset/success',
    name: RouteNames.PasswordResetSuccess,
    component: () => import(/* webpackChunkName: "passwordresetsuccess" */ '../components/PasswordReset/Success')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
