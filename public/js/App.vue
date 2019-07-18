<template>
  <div id="app" class="container">
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from './Login.vue'
  import axios from 'axios'

  async function onMounted() {
    console.log('Beginning login test...')
    var response = await  axios.get(API_URL + '/api/users/auth')
    if (response.data.result !== 'success') {
      // TODO: transition to login page
      this.$router.push('login')
    } else {
      console.log('Already logged in!')
    }
  }

  export default {
    name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {
      Login
    },
    mounted: onMounted
  }
</script>

<style>
body {
  background-color: #fafafa;  
  padding: 100px 0;
  color: #212121;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  text-align: center;
  max-width: 750px;
}
</style>
