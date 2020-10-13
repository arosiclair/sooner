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
    login: async ({ dispatch }, { email, password }) => {
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
    updateUserData: async ({ commit }) => {
      try {
        const resp = await api.get('/users/userData')
        commit('setUserData', resp.data)
        return { success: true }
      } catch (error) {
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
