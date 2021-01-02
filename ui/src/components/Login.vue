<template>
  <div class="content">
    <div class="top-container">
      <fade-in-down>
        <img
          id="logo"
          class="mt-4"
          :src="Logo"
          alt="logo" />
        <h1 class="m-4">Read It Now</h1>
        <form>
          <transition-height>
            <div class="input-container paper-bg shadow-sm rounded overflow-hidden mb-3" :key="registering">
              <input
                v-if="registering"
                v-model="name"
                type="text"
                placeholder="Name"
                class="lg" />
              <input
                v-model="email"
                type="text"
                placeholder="Email"
                @keyup.enter="loginBtnClicked"
                class="lg"
                :class="{ error: error && !validEmail }" />
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                @keyup.enter="loginBtnClicked"
                class="lg"
                :class="{ error: error && !validPass }" />
            </div>
          </transition-height>
          <button id="loginButton" class="btn-lg text-lg shadow-sm rounded mb-4 p-3" type="button" @click="loginBtnClicked" :disabled="loading">
            <b-spinner v-if="loading"/>
            <span v-else>
              {{ registering ? 'SIGN UP' : 'LOGIN' }}
            </span>
          </button>
          <a href="#" @click="registering = !registering">
            {{ registering ? 'Cancel' : 'Sign Up' }}
          </a>
        </form>
      </fade-in-down>
    </div>
    <div class="bottom-container">
      <router-link :to="{ name: RouteNames.ResetRequest }"> Forgot your password?</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Logo from '../assets/logo-rounded.png'
import { RouteNames } from '../router'
import FadeInDown from './utils/FadeInDown.vue'
import TransitionHeight from './utils/TransitionHeight.vue'

export default {
  name: 'Login',
  components: {
    FadeInDown,
    TransitionHeight
  },
  mounted () {
    if (this.loggedIn) {
      this.$router.push({ name: RouteNames.List })
    }
  },
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: '',
      loading: false,
      Logo,
      RouteNames
    }
  },
  computed: {
    validEmail: function () {
      return this.email.length > 0
    },
    validPass: function () {
      return this.password.length > 0
    },
    ...mapGetters({
      loggedIn: 'user/loggedIn'
    })
  },
  methods: {
    async loginBtnClicked (event) {
      this.loading = true
      if (this.registering) {
        await this.register()
      } else {
        await this.login()
      }
      this.loading = false
    },
    async register () {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      const result = await this.dispatchRegister(data)
      if (result.error) {
        this.error = true
        this.$toast.error(result.reason)
      }
    },
    async login () {
      this.error = this.validateLogin()
      if (this.error) {
        this.$toast.error(this.error)
        return
      }

      const result = await this.dispatchLogin({ email: this.email, password: this.password })
      if (!result.success) {
        this.error = true
        this.$toast.error(result.reason)
      } else {
        this.$router.push({ name: RouteNames.List })
      }
    },
    validateLogin () {
      if (!this.validEmail) {
        return 'Enter a valid email'
      } else if (!this.validPass) {
        return 'Enter a password'
      } else {
        return null
      }
    },
    ...mapActions({
      dispatchLogin: 'user/login',
      dispatchRegister: 'user/register'
    })
  }
}
</script>

<style scoped>
.content {
  height: 100%;
}

#logo {
  width: 125px;
}

.input-container {
  transition: 300ms ease;
}

.top-container {
  min-height: calc(100% - 50px);
}
.bottom-container {
  height: 50px;
}
</style>
