<template>
  <div id="app">
    <div class="content py-md-4">
      <div class="container padded-content">
        <PageSlide>
          <router-view />
        </PageSlide>
      </div>
    </div>
    <DebugLayer v-if="isDebug" />
    <UserSettings />
  </div>
</template>

<script>
// global styling
import './styles/inputs.scss'
import './styles/text.css'
import './styles/layout.css'
import './styles/misc.scss'

import DebugLayer from './components/debug/DebugLayer.vue'
import UserSettings from './components/UserSettings.vue'
import { isDebug } from './modules/utilities'
import { mapActions } from 'vuex'
import PageSlide from './components/utils/PageSlide.vue'

export default {
  name: 'App',
  components: {
    DebugLayer,
    UserSettings,
    PageSlide
  },
  data () {
    return {
      isDebug: isDebug()
    }
  },
  mounted () {
    this.updateUserData()
  },
  methods: {
    ...mapActions({
      updateUserData: 'user/refreshData'
    })
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

html, body {
  height: 100%;
}

body {
  background-color: #f5f5f5;
  color: #212121;
  font-family: 'Poppins', sans-serif;

  @media (prefers-color-scheme: dark) {
    background: #212121;
    color: #fff;
  }
}

.font {
  font-family: 'Poppins', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow: auto;
}

/* hide scrollbars for tablets and phones */
@media only screen and (max-width: 768px) {
  .content::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .content {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}

.padded-content {
  text-align: center;
  max-width: 750px;
  height: 100%;
}
</style>
