<template>
  <div id="header">
    <div class="header-left">
      <img
        src="http://via.placeholder.com/50"
        alt="logo" />
      <span id="header-title">ReadItNow</span>
    </div>
    <div class="header-right">
      <a id="usernameLink" href="#">{{ username }}</a>
    </div>
  </div>
</template>

<script>
import user from './user'

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
  mounted: onMounted
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
