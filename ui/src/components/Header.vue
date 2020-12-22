<template>
  <div id="header">
    <div class="header-left">
      <img
        id="logo"
        :src="Logo"
        alt="logo" />
      <span id="header-title" class="d-none d-sm-inline text-xl mx-2">ReadItNow</span>
    </div>
    <div class="header-right">
      <UserMenu />
    </div>
  </div>
</template>

<script>
import Logo from '../assets/logo-rounded.png'
import UserMenu from './UserMenu'
export default {
  name: 'Header',
  components: {
    UserMenu
  },
  data () {
    return {
      Logo
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
    vertical-align: middle;
}

#logo {
  width: 50px;
}
</style>
