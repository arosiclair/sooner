import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import AddLink from '../components/AddLink'
import AddFailed from '../components/AddFailed'
import AddSuccess from '../components/AddSuccess'

Vue.use(VueRouter)

export const RouteNames = {
  Login: 'Login',
  Adding: 'Adding',
  AddSuccess: 'AddSuccess',
  AddFailed: 'AddFailed'
}

const routes = [
  {
    path: '/login',
    name: RouteNames.Login,
    component: Login
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
    component: AddSuccess
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
