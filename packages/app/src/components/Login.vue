<template>
  <div class="content">
    <div class="top-container">
      <LetterHead />
      <form>
        <div
          class="paper-bg shadow-sm rounded overflow-hidden mb-3"
        >
          <ScaleHeightInOut>
            <div v-if="registering">
              <input
                v-model="name"
                type="text"
                placeholder="Name"
                class="lg"
                :class="{ error: error && !validName }"
              >
            </div>
          </ScaleHeightInOut>
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

        <ScaleHeightInOut>
          <div v-if="registering">
            <PasswordReqs
              :password="password"
              :error="Boolean(error)"
              class="mb-3"
            />
          </div>
        </ScaleHeightInOut>

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
import { isValidPassword } from '../modules/password-validation'
import { RouteNames } from '../router'
import BigSubmitBtn from './BigSubmitBtn.vue'
import LetterHead from './LetterHead.vue'
import PasswordReqs from './PasswordReqs.vue'
import ScaleHeightInOut from './utils/ScaleHeightInOut.vue'

export default {
  name: 'Login',
  components: {
    BigSubmitBtn,
    LetterHead,
    PasswordReqs,
    ScaleHeightInOut
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
    validName: function () {
      return this.name.length >= 3 && this.name.length <= 32
    },
    validEmail: function () {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email)
    },
    validPass: function () {
      return isValidPassword(this.password)
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
      if (!this.validName || !this.validEmail || !this.validPass) {
        this.error = true
        return
      }

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
