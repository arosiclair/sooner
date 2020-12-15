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
        await api.post('/user/login', loginData)
      } catch (error) {
        if (error.response.status === 401) {
          return {
            error: true,
            reason: 'Incorrect email or password'
          }
        } else {
          return {
            error: true,
            reason: 'There was an issue logging in'
          }
        }
      }

      return dispatch('refreshData')
    },

    async register ({ dispatch }, newUser) {
      try {
        var resp = await api.post('/user/register', newUser)
      } catch (error) {
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }

      if (resp.data.error) {
        return {
          error: true,
          reason: 'There was an issue creating your account'
        }
      }

      return dispatch('refreshData')
    },

    async refreshData ({ commit }) {
      try {
        var resp = await api.get('/user/data')
      } catch (error) {
        commit('resetUserdata')
        return {
          error: true,
          reason: 'There was an issue getting your data'
        }
      }

      commit('setUserData', resp.data)
      return { success: true }
    },

    async updateData ({ commit }, changes) {
      try {
        var resp = await api.patch('/user/data', changes)
      } catch (error) {
        return {
          error: true,
          reason: 'There was an issue updating your settings'
        }
      }

      commit('setUserData', resp.data.data)
      return { success: true }
    },

    async logout ({ dispatch }) {
      try {
        await api.post('/user/logout')
      } catch (e) {
        return {
          error: true,
          reason: 'There was an issue logging out'
        }
      }

      return dispatch('refreshData')
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
