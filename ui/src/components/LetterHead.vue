<template>
  <router-link
    class="home-link"
    :to="homeRoute"
  >
    <div class="letter-head-container p-3">
      <img
        id="logo"
        :src="Logo"
        class="mr-4"
      >
      <h1 class="m-0">
        Sooner
      </h1>
    </div>
  </router-link>
</template>

<script>
import Logo from '@/assets/logo-rounded.png'
import { RouteNames } from '../router'
export default {
  data () {
    return {
      Logo,
      homeRoute: {
        name: RouteNames.Landing
      }
    }
  }
}
</script>

<style scoped>
.home-link {
 color: inherit;
 text-decoration: none;
}
.letter-head-container {
 display: flex;
 justify-content: center;
 align-items: center;
}

#logo {
  width: 50px;
}

h1 {
  font-weight: 900;
}

</style>
