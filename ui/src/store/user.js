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
    },
    resetUserdata: (state) => {
      state.name = ''
      state.email = ''
      state.prefs = ''
      state.loggedIn = false
    }
  },
  actions: {
    async login ({ dispatch }, { email, password }) {
      const loginData = {
        email: email,
        password: password
      }

      try {
        var resp = await api.post('/user/login', loginData)
        if (resp.data.result === 'success') {
          console.log('Log in successful!')
          return dispatch('refreshData')
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
        var resp = await api.post('/user/register', data)
      } catch (error) {
        console.log('Register error: \n', error)
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }

      if (resp.data.result === 'success') {
        console.log('Sign up successful!')
        return dispatch('refreshData')
      } else {
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }
    },

    async refreshData ({ commit }) {
      let error = ''
      try {
        var resp = await api.get('/user/data')
      } catch (e) {
        error = 'There was an issue getting your data'
      }

      error = error || resp.data.reason
      if (!error) {
        commit('setUserData', resp.data)
        return { success: true }
      } else {
        commit('resetUserdata')
        return {
          error: true,
          reason: error
        }
      }
    },

    async updateData ({ commit }, changes) {
      try {
        var resp = await api.patch('/user/data', changes)
      } catch (e) {
        var error = 'There was an issue updating your settings'
      }

      error = error || resp.data.reason
      if (!error) {
        commit('setUserData', resp.data.data)
        return { success: true }
      } else {
        return {
          error: true,
          reason: error
        }
      }
    },

    async logout ({ dispatch }) {
      let error = ''
      try {
        var resp = await api.post('/user/logout')
      } catch (e) {
        error = 'There was an issue logging out'
      }

      error = error || resp.data.reason
      if (!error) {
        return dispatch('refreshData')
      } else {
        return {
          error: true,
          reason: error
        }
      }
    }
  },
  getters: {
    loggedIn: ({ loggedIn }) => loggedIn,
    data: ({ name, email, prefs }) => {
      return {
        name,
        email,
        prefs
      }
    },
    name: ({ name }) => name || 'unknown',
    prefs: ({ prefs }) => prefs
  }
}
