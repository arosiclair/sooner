import Vue from 'vue'
import VueRouter from 'vue-router'
import LandingPage from '../components/LandingPage.vue'

export const RouteNames = {
  Landing: 'Landing',
  Apps: 'Apps',
  Privacy: 'Privacy',
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
    path: '/apps',
    name: RouteNames.Apps,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "apps-page" */ '../components/AppsPage.vue')
  },
  {
    path: '/privacy',
    name: RouteNames.Privacy,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "privacy-page" */ '../components/PrivacyPage.vue')
  },
  {
    path: '/list',
    name: RouteNames.List,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user-list" */ '../components/List/UserList.vue')
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/resetRequest',
    name: RouteNames.ResetRequest,
    component: () => import(/* webpackChunkName: "password-reset-request" */ '../components/PasswordReset/Request')
  },
  {
    path: '/resetRequest/success',
    name: RouteNames.ResetRequestSuccess,
    component: () => import(/* webpackChunkName: "password-reset-success" */ '../components/PasswordReset/Success'),
    props: {
      message: 'Check your email for more instructions.'
    }
  },
  {
    path: '/passwordReset',
    name: RouteNames.PasswordReset,
    component: () => import(/* webpackChunkName: "password-reset" */ '../components/PasswordReset/Reset')
  },
  {
    path: '/passwordReset/success',
    name: RouteNames.PasswordResetSuccess,
    component: () => import(/* webpackChunkName: "password-reset-success" */ '../components/PasswordReset/Success'),
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
