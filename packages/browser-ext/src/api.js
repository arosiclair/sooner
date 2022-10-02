import axios from 'axios'

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_API_URL
})

export default api

export const addLink = (url, name = '', siteName = '') => api.post('/list', { url, name, siteName })

export const checkLogin = () => api.get('/user/data')

export const login = (email, password) => api.post('/user/login', { email, password })

export const logout = () => api.post('/user/logout')

export const deleteLink = (linkId) => api.delete(`/list/${linkId}`)
