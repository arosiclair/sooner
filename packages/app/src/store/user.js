import api from '../modules/api'
import notificationsApi from '../modules/notifications-api'

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
        if (error.response && error.response.status === 401) {
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
        // pull and merge preferences from each api
        const [{ data: userData }, { data: pushPrefs }] = await Promise.all([
          api.get('/user/data'),
          notificationsApi.get('/subscription')
        ])

        userData.prefs.push = pushPrefs
        commit('setUserData', userData)
        return { success: true }
      } catch (error) {
        console.error(error)
        commit('resetUserdata')
        return {
          error: true,
          reason: 'There was an issue getting your data'
        }
      }
    },

    async updateData ({ commit }, { userChanges, pushChanges }) {
      try {
        // update and merge preferences for each api
        const [{ data: user }, { data: push }] = await Promise.all([
          api.patch('/user/data', userChanges),
          notificationsApi.patch('/subscription', pushChanges)
        ])

        user.data.prefs.push = push
        commit('setUserData', user.data)
        return { success: true }
      } catch (error) {
        console.error(error)
        return {
          error: true,
          reason: 'There was an issue updating your settings'
        }
      }
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
