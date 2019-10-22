<template>
  <div id="header">
    <div class="header-left">
      <img
        src="https://via.placeholder.com/50"
        alt="logo" />
      <span id="header-title">ReadItNow</span>
    </div>
    <div class="header-right">
      <a id="usernameLink" href="#" @click="logout">{{ username }}</a>
    </div>
  </div>
</template>

<script>
import user from '../js/user'
import api from '../js/api'

function onMounted () {
  this.username = user.name
}

export default {
  name: 'Header',
  data () {
    return {
      username: 'unknown'
    }
  },
  mounted: onMounted,
  methods: {
    logout: function () {
      api.post(API_URL + '/users/logout')
        .then(result => {
          if (result.data.result === 'success') {
            this.$emit('logged-off')
          } else {
            console.log('Log off failed!')
          }
        })
    }
  }
}
</script>

<style>
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
}

#header-title {
    font-family: 'Rubik', sans-serif;
    font-size: 24px;
    vertical-align: middle;
    margin-left: 10px;
}

#usernameLink {
    font-family: 'Rubik', sans-serif;
    font-size: 24px;
}
</style>
