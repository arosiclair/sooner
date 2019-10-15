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
      var resp = await api.post(API_URL + '/users/register', data)
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
      var resp = await api.post(API_URL + '/users/login', loginData)
    } catch (error) {
      console.log('Log in error: \n', error)
      return {
        error: true,
        reason: 'There was an issue logging in'
      }
    }

    if (resp.data.result === 'success') {
      console.log('Log in successful!')

      // update user module
      this.name = resp.data.name
      this.token = resp.data.token

      return { success: true }
    } else {
      console.log('Log in failed!', resp.data)
      return {
        error: true,
        reason: 'Incorrect email or password'
      }
    }
  }
}
