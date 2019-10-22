<template>
  <div id="app">
    <Header v-if="loggedIn" @logged-off="onLoggedOff"></Header>
    <div class="container content">
      <List v-if="loggedIn"></List>
      <Login v-else @logged-in="onLoggedIn"></Login>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import Login from './Login'
import List from './List'
import currentUser from '../js/user'

export default {
  name: 'App',
  components: {
    Header,
    Login,
    List
  },

  data () {
    return {
      loggedIn: false
    }
  },

  mounted: async function () {
    console.log('Beginning login test...')
    var result = await currentUser.updateUserData()
    this.loggedIn = result.success
  },

  methods: {
    onLoggedIn: function () {
      this.loggedIn = true
    },
    onLoggedOff: function () {
      this.loggedIn = false
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');

body {
  background-color: #fafafa;
  color: #212121;
  font-family: 'Rubik', sans-serif;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.content {
  text-align: center;
  max-width: 750px;
  padding-top: 100px;
  padding-bottom: 100px;
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
    background-color: #0000001c;
    cursor: pointer;
}
</style>
