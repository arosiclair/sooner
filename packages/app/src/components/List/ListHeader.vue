<template>
  <div
    id="header"
    class=" pt-3 mb-3"
  >
    <div class="header-left">
      <Logo50 />
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
import ListHeaderMenu from './ListHeaderMenu'
import Logo50 from '../Logo50.vue'
export default {
  name: 'Header',
  components: {
    ListHeaderMenu,
    Logo50
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
</style>
