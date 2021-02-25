<template>
  <div class="content">
    <transition-height>
      <router-view></router-view>
    </transition-height>
  </div>
</template>

<script>
import { checkLogin } from '../api'
import TransitionHeight from '../components/TransitionHeight.vue'
import { RouteNames } from '../popup/router'

export default {
  name: 'App',
  components: {
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
        this.$router.push({ name: RouteNames.Adding })
      } catch (error) {
        this.$router.push({ name: RouteNames.Login })
      }
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
