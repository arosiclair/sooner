import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import AddLink from '../components/AddLink'
import AddFailed from '../components/AddFailed'
import AddSuccess from '../components/AddSuccess'
import TryLogin from '../components/TryLogin'
import Intro from '../components/Intro'

Vue.use(VueRouter)

export const RouteNames = {
  TryLogin: 'TryLogin',
  Login: 'Login',
  Intro: 'Intro',
  Adding: 'Adding',
  AddSuccess: 'AddSuccess',
  AddFailed: 'AddFailed'
}

const routes = [
  {
    path: '/tryLogin',
    name: RouteNames.TryLogin,
    component: TryLogin
  },
  {
    path: '/login',
    name: RouteNames.Login,
    component: Login
  },
  {
    path: '/intro',
    name: RouteNames.Intro,
    component: Intro
  },
  {
    path: '/adding',
    name: RouteNames.Adding,
    component: AddLink
  },
  {
    path: '/addFailed',
    name: RouteNames.AddFailed,
    component: AddFailed,
    props: true
  },
  {
    path: '/addSuccess',
    name: RouteNames.AddSuccess,
    component: AddSuccess,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
