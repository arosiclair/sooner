<template>
  <div id="app" class="container">
    <router-view></router-view>
    <List v-if="loggedIn"></List>
  </div>
</template>

<script>
import Login from './Login.vue'
import List from './List.vue'
import axios from 'axios'

async function onMounted () {
  console.log('Beginning login test...')
  this.loggedIn = await testLogin()
  if (!this.loggedIn) {
    this.$router.push('login')
  }
}

async function testLogin () {
  var response = await axios.get(API_URL + '/api/users/auth')
  return response.data.result === 'success'
}

export default {
  name: 'app',
  data () {
    return {
      loggedIn: false
    }
  },
  components: {
    Login,
    List
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
