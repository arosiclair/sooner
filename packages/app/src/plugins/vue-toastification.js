import Vue from 'vue'
import Toast, { POSITION } from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

const options = {
  transition: 'Vue-Toastification__fade',
  maxToasts: 20,
  newestOnTop: true,
  position: POSITION.BOTTOM_CENTER,
  hideProgressBar: true,
  pauseOnFocusLoss: true
}

Vue.use(Toast, options)
