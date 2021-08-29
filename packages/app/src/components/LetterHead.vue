<template>
  <router-link
    class="home-link"
    :to="homeRoute"
  >
    <div class="letter-head-container p-3">
      <Logo50 class="mr-4" />
      <h1 class="m-0">
        Sooner
      </h1>
    </div>
  </router-link>
</template>

<script>
import { RouteNames } from '../router'
import Logo50 from './Logo50.vue'
export default {
  components: { Logo50 },
  data () {
    return {
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
  font-weight: 500;
}

</style>
