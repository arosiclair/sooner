<template>
  <div class="content">
    <div class="top-container">
      <LetterHead />
      <form>
        <TransitionHeight>
          <div
            :key="registering"
            class="paper-bg shadow-sm rounded overflow-hidden mb-3"
          >
            <input
              v-if="registering"
              v-model="name"
              type="text"
              placeholder="Name"
              class="lg"
            >
            <input
              v-model="email"
              type="text"
              placeholder="Email"
              class="lg"
              :class="{ error: error && !validEmail }"
              @keyup.enter="submit"
            >
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="lg"
              :class="{ error: error && !validPass }"
              @keyup.enter="submit"
            >
          </div>
        </TransitionHeight>

        <TransitionHeight>
          <div
            :key="registering"
            class="mb-3"
          >
            <PasswordReqs
              v-if="registering"
              :password="password"
              :error="Boolean(error)"
            />
          </div>
        </TransitionHeight>

        <BigSubmitBtn
          :label="submitLabel"
          :on-submit="submit"
          :loading="loading"
          class="mb-4"
        />
        <a
          href="#"
          @click="registering = !registering"
        >
          {{ registering ? 'Cancel' : 'Sign Up' }}
        </a>
      </form>
    </div>
    <div class="bottom-container">
      <router-link :to="{ name: RouteNames.ResetRequest }">
        Forgot your password?
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { RouteNames } from '../router'
import BigSubmitBtn from './BigSubmitBtn.vue'
import LetterHead from './LetterHead.vue'
import PasswordReqs from './PasswordReqs.vue'
import TransitionHeight from './utils/TransitionHeight.vue'

export default {
  name: 'Login',
  components: {
    TransitionHeight,
    BigSubmitBtn,
    LetterHead,
    PasswordReqs
  },
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: '',
      loading: false,
      RouteNames
    }
  },
  computed: {
    submitLabel () {
      return this.registering ? 'Sign Up' : 'Login'
    },
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
  async mounted () {
    await this.updateUserData()
    if (this.loggedIn) {
      this.$router.push({ name: RouteNames.List })
    }
  },
  methods: {
    async submit (event) {
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
      } else {
        this.$router.push({ name: RouteNames.List })
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
      updateUserData: 'user/refreshData',
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

.top-container {
  min-height: calc(100% - 50px);
}
.bottom-container {
  height: 50px;
}
</style>
