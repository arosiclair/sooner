import axios from 'axios'

export default axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_NOTIFICATIONS_API_URL
})
