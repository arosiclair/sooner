<template>
  <transition-height>
    <div class="content" :key="state">
      <add-link v-if="state === 'loggedIn'" />
      <login v-else-if="state === 'login'" @logged-in="onLoggedIn" />
    </div>
  </transition-height>
</template>

<script>
import Login from '../components/Login.vue'
import { checkLogin } from '../api'
import AddLink from '../components/AddLink.vue'
import TransitionHeight from '../components/TransitionHeight.vue'

export default {
  name: 'App',
  components: {
    Login,
    AddLink,
    TransitionHeight
  },
  data () {
    return {
      state: ''
    }
  },
  mounted () {
    this.tryLogin()
  },
  methods: {
    async tryLogin () {
      try {
        await checkLogin()
        this.state = 'loggedIn'
      } catch (error) {
        this.state = 'login'
      }
    },
    onLoggedIn () {
      this.state = 'loggedIn'
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
