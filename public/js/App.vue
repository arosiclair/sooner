<template>
  <div id="app">
    <img src="../img/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
  import Login from './Login.vue'
  import axios from 'axios'

  async function loginTest() {
    console.log('Beginning login test...')
    var response = await  axios.get('/api/users/auth')
    if (response.data.result !== 'success') {
      // TODO: transition to login page
      console.log('Not logged in!')
      console.log('Logging in...')

      var creds = {
        email: 'arosiclair@gmail.com',
        password: 'asdasA1asd'
      }
      response = await axios.post('/api/users/login', creds)
      if (response.data.result === 'success')
        console.log('Initial login success...')
      else
        console.log('Login Failed!')

      response = await axios.get('/api/users/auth')
      if (response.data.result === 'success')
        console.log('Login session is valid!')
      else
        console.log('Login session not valid!')
    } else {
      console.log('Already logged in!')
    }
  }

  loginTest()


  export default {
    name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      Login
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
