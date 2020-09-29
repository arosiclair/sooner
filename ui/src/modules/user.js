import api from './api'

export default {
  name: 'unknown',
  token: 'unknown',
  prefs: {},
  register: async function (name, email, password) {
    var data = {
      name: name,
      email: email,
      password: password
    }

    try {
      var resp = await api.post('/users/register', data)
    } catch (error) {
      console.log('Register error: \n', error)
      return {
        error: true,
        reason: 'There was an registering your account'
      }
    }

    if (resp.data.result === 'success') {
      console.log('Sign up successful!')

      // update user module
      this.name = resp.data.name
      this.token = resp.data.token

      return { success: true }
    } else {
      return {
        error: true,
        reason: 'There was an issue creating your account'
      }
    }
  },
  login: async function (email, password) {
    var loginData = {
      email: email,
      password: password
    }

    try {
      // login
      var resp = await api.post('/users/login', loginData)
      if (resp.data.result === 'success') {
        console.log('Log in successful!')
        // get user data
        return this.updateUserData()
      } else {
        return {
          error: true,
          reason: 'Incorrect email or password'
        }
      }
    } catch (error) {
      console.log('Log in error: \n', error)
      return {
        error: true,
        reason: 'There was an issue logging in'
      }
    }
  },
  updateUserData: async function () {
    var resp = await api.get('/users/userData')
    if (resp.data.result === 'success') {
      this.name = resp.data.name
      this.email = resp.data.email
      this.prefs = resp.data.prefs
      return { success: true }
    } else {
      return {
        error: true,
        reason: resp.data.reason
      }
    }
  }
}
