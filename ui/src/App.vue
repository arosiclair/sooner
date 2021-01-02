<template>
  <div id="app">
    <div class="content py-md-4">
      <div class="container padded-content">
        <transition-page v-if="ready"></transition-page>
        <b-spinner v-else class="m-5" />
      </div>
    </div>
    <DebugLayer v-if="isDebug" />
    <Settings />
  </div>
</template>

<script>
// global styling
import './styles/inputs.css'
import './styles/text.css'
import './styles/layout.css'
import './styles/misc.css'

import Settings from './components/Settings'
import DebugLayer from './components/debug/DebugLayer'
import { mapGetters, mapActions } from 'vuex'
import { isDebug } from './modules/utilities'
import { RouteNames } from './router'
import TransitionPage from './components/TransitionPage.vue'
import 'animate.css'

export default {
  name: 'App',
  components: {
    DebugLayer,
    Settings,
    TransitionPage
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
    if (this.currentPath === '/') {
      if (!this.loggedIn) {
        this.$router.push({ name: RouteNames.Login })
      } else {
        this.$router.push({ name: RouteNames.List })
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

html, body {
  height: 100%;
}

body {
  background-color: #f5f5f5;
  color: #212121;
  font-family: 'Poppins', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow: auto;
}
.content::-webkit-scrollbar-track
{
  background-color: transparent;
}

.content::-webkit-scrollbar
{
  width: 8px;
  background-color: transparent;
}

.content::-webkit-scrollbar-thumb
{
  border-radius: 10px;
  background-color: #c5c5c5;
}

.padded-content {
  text-align: center;
  max-width: 750px;
  height: 100%;
}
</style>
