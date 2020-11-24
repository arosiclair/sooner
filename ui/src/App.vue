<template>
  <div id="app">
    <Header v-if="loggedIn"></Header>
    <div class="container content my-0 my-md-5">
      <List v-if="loggedIn"></List>
      <Login v-else></Login>
      <Settings />
    </div>
    <DebugLayer v-if="isDebug" />
  </div>
</template>

<script>
import Header from './components/Header'
import Login from './components/Login'
import List from './components/List'
import Settings from './components/Settings'
import DebugLayer from './components/debug/DebugLayer'
import { mapGetters, mapActions } from 'vuex'
import { isDebug } from './modules/utilities'

export default {
  name: 'App',
  components: {
    Header,
    Login,
    List,
    DebugLayer,
    Settings
  },
  data () {
    return {
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
    this.updateUserData()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');

body {
  background-color: #f5f5f5;
  color: #212121;
  font-family: 'Rubik', sans-serif;
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

/* input styling */
.lg-input {
    width: 100%;
    font-size: 24px;
    font-family: 'Rubik', sans-serif;
    padding: 15px;
    margin: 0;

    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #ffffff;

    transition: 300ms ease;
}
.lg-input:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}
.lg-input:focus {
    outline: none;
    border-bottom: 1px solid #28b5f4;
}
.lg-input.error {
    border-bottom: 1px solid #e53635;
}

.form-input {
    font-size: 1.25rem;
    padding: 1rem 0.5rem;
    margin: 0;

    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #eeeeee;

    border-radius: 0;

    transition: 300ms ease;
}
.form-input:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}
.form-input:focus {
    outline: none;
    box-shadow: none;
    border-bottom: 1px solid #28b5f4;
}
.form-input.error {
    border-bottom: 1px solid #e53635;
}
</style>
