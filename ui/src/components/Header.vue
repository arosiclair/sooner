<template>
  <div id="header">
    <div class="header-left">
      <img
        src="https://via.placeholder.com/50"
        alt="logo" />
      <span id="header-title">ReadItNow</span>
    </div>
    <div class="header-right">
      <UserMenu />
    </div>
  </div>
</template>

<script>
import UserMenu from './UserMenu'
export default {
  name: 'Header',
  components: {
    UserMenu
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

</style>
