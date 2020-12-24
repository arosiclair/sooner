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
  computed: mapGetters({
    loggedIn: 'user/loggedIn'
  }),

  methods: mapActions({
    updateUserData: 'user/refreshData'
  }),

  mounted: async function () {
    await this.updateUserData()
    this.ready = true
  },

  updated () {
    // login/logout routing
    if (!this.loggedIn && this.$route.path !== '/login') {
      this.$router.push('/login')
    } else if (this.loggedIn && this.$route.path !== '/list') {
      this.$router.push('/list')
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

.centered-container {
    display: flex;
    align-items: center;
}

.centered-container.split {
    justify-content: space-between;
}

.material-icons {
    color: #c7c7c7;
    font-size: 30px;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
}
.material-icons.actionable:hover {
    color: #28b5f4;
    background-color: #0000000f;
    cursor: pointer;
}

.paper-bg {
  background-color: #fff;
}

.overflow-hidden {
  overflow: hidden;
}

/* text styling */

.text-sm {
  font-size: 0.8rem;
}

.text-lg {
  font-size: 1.2rem;
}

.text-xl {
  font-size: 1.5rem;
}

/* input styling */

input {
    width: 100%;
    padding: 0.8rem;
    margin: 0;

    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #ffffff;

    transition: 300ms ease;
}

input.lg {
    font-size: 1.2rem;
}
input.lg:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}
input.lg:focus {
    outline: none;
    border-bottom: 1px solid #28b5f4;
}
input.lg.error {
    border-bottom: 1px solid #e53635;
}

input.form {
    font-size: 1.2rem;
    padding: 1rem 0.5rem;
    margin: 0;

    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #eeeeee;
    border-radius: 0;

    transition: 300ms ease;
}
input.form:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}
input.form:focus {
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #28b5f4;
}
input.form.error {
    border-bottom: 1px solid #e53635;
}
</style>
