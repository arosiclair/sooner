<template>
  <div id="app">
    <Header v-if="loggedIn"></Header>
    <div class="container content">
      <List v-if="loggedIn"></List>
      <Login v-else></Login>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import Login from './components/Login'
import List from './components/List'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Header,
    Login,
    List
  },

  computed: mapGetters({
    loggedIn: 'user/loggedIn'
  }),

  methods: mapActions({
    updateUserData: 'user/updateUserData'
  }),

  mounted: async function () {
    this.updateUserData()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik&display=swap');

body {
  background-color: #fafafa;
  color: #212121;
  font-family: 'Rubik', sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.content {
  text-align: center;
  max-width: 750px;
  padding-top: 100px;
  padding-bottom: 100px;
}

.centered-container {
    display: flex;
    align-items: center;
}

.centered-container.split {
    justify-content: space-between;
}

.material-icons {
    color: #c7c7c7;
    font-size: 30px;
    padding: 10px;
    border-radius: 50%;
    cursor: pointer;
}
.material-icons.actionable:hover {
    color: #28b5f4;
    background-color: #0000000f;
    cursor: pointer;
}

.paper-bg {
  background-color: #fff;
}

</style>
