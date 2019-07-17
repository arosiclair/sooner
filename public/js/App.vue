<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import Login from './Login.vue'
  import axios from 'axios'

  async function onMounted() {
    console.log('Beginning login test...')
    var response = await  axios.get('/api/users/auth')
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
