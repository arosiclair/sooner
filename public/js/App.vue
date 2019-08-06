<template>
  <div id="app" class="container">
    <List v-if="loggedIn"></List>
    <Login v-else @logged-in="loggedIn = true"></Login>
  </div>
</template>

<script>
import Login from './Login.vue'
import List from './List.vue'
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
  padding: 100px 0;
  color: #212121;
  font-family: 'Rubik', sans-serif;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  text-align: center;
  max-width: 750px;
}
</style>
