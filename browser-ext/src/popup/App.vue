<template>
  <div class="content">
    <!-- <div v-if="loggedIn">
      <h1>Logged In!</h1>
      <button @click="logout">Logout</button>
    </div> -->
    <add-link v-if="loggedIn" />
    <login v-else @logged-in="onLoggedIn" />
  </div>
</template>

<script>
import Login from '../components/Login.vue'
import { checkLogin } from '../api'
import AddLink from '../components/AddLink.vue'

export default {
  name: 'App',
  components: { Login, AddLink },
  data () {
    return {
      loggedIn: false
    }
  },
  mounted () {
    this.tryLogin()
  },
  methods: {
    async tryLogin () {
      try {
        await checkLogin()
        this.loggedIn = true
      } catch (error) {
        this.loggedIn = false
      }
    },
    onLoggedIn () {
      this.loggedIn = true
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

html {
  width: 400px;
  height: auto;
}

.content {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f5f5;
  color: #212121;
}
</style>
