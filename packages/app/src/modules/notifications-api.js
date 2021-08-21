import axios from 'axios'

export default axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_PUSH_API_URL
})
