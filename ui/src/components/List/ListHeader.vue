<template>
  <div
    id="header"
    class=" pt-3 mb-3"
  >
    <div class="header-left">
      <img
        id="logo"
        :src="Logo"
        alt="logo"
      >
      <span
        id="header-title"
        class="d-none d-sm-inline text-xl text-xbold mx-3"
      >Sooner</span>
    </div>
    <div class="header-right">
      <list-header-menu />
    </div>
  </div>
</template>

<script>
import Logo from '@/assets/logo-rounded.png'
import ListHeaderMenu from './ListHeaderMenu'
export default {
  name: 'Header',
  components: {
    ListHeaderMenu
  },
  data () {
    return {
      Logo
    }
  }
}
</script>

<style scoped>
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid lightgray; */
}

#header-title {
  vertical-align: middle;
}

#logo {
  width: 50px;
}
</style>
