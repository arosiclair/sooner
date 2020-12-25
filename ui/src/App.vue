<template>
  <div id="app">
    <Header v-if="loggedIn"></Header>
    <div class="container content my-0 my-md-5">
      <router-view v-if="ready"></router-view>
      <Settings />
    </div>
    <DebugLayer v-if="isDebug" />
  </div>
</template>

<script>
import Header from './components/Header'
import Settings from './components/Settings'
import DebugLayer from './components/debug/DebugLayer'
import { mapGetters, mapActions } from 'vuex'
import { isDebug } from './modules/utilities'

// global styling
import './styles/inputs.css'
import './styles/text.css'
import './styles/layout.css'
import './styles/misc.css'

export default {
  name: 'App',
  components: {
    Header,
    DebugLayer,
    Settings
  },
  data () {
    return {
      ready: false,
      isDebug: isDebug()
    }
  },
  computed: {
    currentPath () {
      if (this.$route.path !== '/') {
        return this.$route.path
      } else if (document.location.pathname !== '/') {
        return document.location.pathname
      } else {
        return '/'
      }
    },
    ...mapGetters({
      loggedIn: 'user/loggedIn'
    })
  },

  methods: mapActions({
    updateUserData: 'user/refreshData'
  }),

  mounted: async function () {
    await this.updateUserData()
    this.ready = true
  },

  updated () {
    // login/logout routing
    if (this.currentPath !== '/passwordReset') {
      if (!this.loggedIn && this.currentPath !== '/login') {
        this.$router.push('/login')
      } else if (this.loggedIn && this.currentPath !== '/list') {
        this.$router.push('/list')
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

body {
  background-color: #f5f5f5;
  color: #212121;
  font-family: 'Poppins', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.content {
  text-align: center;
  max-width: 750px;
}
</style>
