import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '../components/LandingPage'

export const RouteNames = {
  Landing: 'Landing',
  List: 'List',
  Login: 'Login',
  ResetRequest: 'ResetRequest',
  ResetRequestSuccess: 'ResetRequestSuccess',
  PasswordReset: 'PasswordReset',
  PasswordResetSuccess: 'PasswordResetSuccess'
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: RouteNames.Landing,
    component: LandingPage
  },
  {
    path: '/list',
    name: RouteNames.List,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "list" */ '../components/List/UserList.vue')
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/resetRequest',
    name: RouteNames.ResetRequest,
    component: () => import(/* webpackChunkName: "passwordresetsuccess" */ '../components/PasswordReset/Request')
  },
  {
    path: '/resetRequest/success',
    name: RouteNames.ResetRequestSuccess,
    component: () => import(/* webpackChunkName: "passwordresetsuccess" */ '../components/PasswordReset/Success'),
    props: {
      message: 'Check your email for more instructions.'
    }
  },
  {
    path: '/passwordReset',
    name: RouteNames.PasswordReset,
    component: () => import(/* webpackChunkName: "passwordreset" */ '../components/PasswordReset/Reset')
  },
  {
    path: '/passwordReset/success',
    name: RouteNames.PasswordResetSuccess,
    component: () => import(/* webpackChunkName: "passwordresetsuccess" */ '../components/PasswordReset/Success'),
    props: {
      message: 'Your password has been updated.'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
