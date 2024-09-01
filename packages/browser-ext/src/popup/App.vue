<template>
  <div class="p-3 content">
    <transition-height>
      <router-view />
    </transition-height>
  </div>
</template>

<script>
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
    this.$router.push({ name: RouteNames.TryLogin })
  }
}
</script>

<style>
@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-Regular.ttf');
  font-style: normal;
  font-weight: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-Italic.ttf');
  font-style: italic;
  font-weight: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-Medium.ttf');
  font-style: normal;
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-MediumItalic.ttf');
  font-style: italic;
  font-weight: 500;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-Bold.ttf');
  font-style: normal;
  font-weight: bold;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('../fonts/Poppins-BoldItalic.ttf');
  font-style: italic;
  font-weight: bold;
  font-display: swap;
}

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
