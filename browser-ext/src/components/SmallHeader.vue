<template>
  <div class="mb-2">
    <a class="logo-link" href="https://www.sooner.app/list" target="_blank" rel="noopener noreferrer">
      <img :src="Logo" class="logo" />
      Sooner
    </a>
  </div>
</template>

<script>
import Logo from '@/assets/logo.png'
export default {
  data () {
    return {
      Logo
    }
  }
}
</script>

<style>
.logo {
  width: 25px;
}

.logo-link, .logo-link:hover {
  color: inherit;
  text-decoration: none;
  background-color:  none;
}
</style>
