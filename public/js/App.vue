<template>
  <div id="app">
    <Header v-if="loggedIn"></Header>
    <div class="container content">
      <List v-if="loggedIn"></List>
      <Login v-else @logged-in="loggedIn = true"></Login>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import Login from './Login'
import List from './List'
import api from './api'

async function onMounted () {
  console.log('Beginning login test...')
  this.loggedIn = await testLogin()
}

async function testLogin () {
  var response = await api.get(API_URL + '/api/users/auth')
  return response.data.result === 'success'
}

export default {
  name: 'app',
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
  mounted: onMounted
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
</style>
