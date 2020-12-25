<template>
  <div>
    <img
      id="logo"
      class="mt-4"
      :src="Logo"
      alt="logo" />
    <h1 class="m-4">Read It Now</h1>
    <form>
      <div class="shadow-sm rounded overflow-hidden mb-3">
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
      <button id="loginButton" class="btn-lg text-lg shadow-sm rounded mb-4 p-3" type="button" @click="loginBtnClicked" :disabled="loading">
        <b-spinner v-if="loading"/>
        <span v-else>
          {{ registering ? 'SIGN UP' : 'LOGIN' }}
        </span>
      </button>
      <a href="#" @click="registering = !registering">
        {{ registering ? 'CANCEL' : 'SIGN UP' }}
      </a>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Logo from '../assets/logo-rounded.png'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: '',
      loading: false,
      Logo
    }
  },
  computed: {
    validEmail: function () {
      return this.email.length > 0
    },
    validPass: function () {
      return this.password.length > 0
    }
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
#logo {
  width: 125px;
}
</style>
