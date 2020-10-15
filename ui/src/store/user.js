import api from '../modules/api'

export default {
  namespaced: true,
  state: {
    loggedIn: false,
    name: '',
    email: '',
    prefs: {}
  },
  mutations: {
    setUserData: (state, payload) => {
      state.name = payload.name
      state.email = payload.email
      state.prefs = payload.prefs
      state.loggedIn = true
    }
  },
  actions: {
    async login ({ dispatch }, { email, password }) {
      const loginData = {
        email: email,
        password: password
      }

      try {
        var resp = await api.post('/users/login', loginData)
        if (resp.data.result === 'success') {
          console.log('Log in successful!')
          return dispatch('updateUserData')
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

    async register ({ dispatch }, newUser) {
      const data = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      }

      try {
        var resp = await api.post('/users/register', data)
      } catch (error) {
        console.log('Register error: \n', error)
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }

      if (resp.data.result === 'success') {
        console.log('Sign up successful!')
        return dispatch('updateUserData')
      } else {
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }
    },

    async updateUserData ({ commit }) {
      try {
        var resp = await api.get('/users/userData')
      } catch (error) {
        return {
          error: true,
          reason: 'There was an issue getting your data'
        }
      }

      if (resp.data.result === 'success') {
        commit('setUserData', resp.data)
        return { success: true }
      } else {
        return {
          error: true,
          reason: 'There was an issue getting your data'
        }
      }
    }
  },
  getters: {
    loggedIn: ({ loggedIn }) => loggedIn,
    userData: ({ name, email, prefs }) => {
      return {
        name,
        email,
        prefs
      }
    }
  }
}
