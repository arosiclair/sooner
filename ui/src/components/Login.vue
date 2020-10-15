<template>
  <div>
    <img
      id="logo"
      src="https://via.placeholder.com/150"
      alt="logo" />
    <form>
      <div v-if="error" id="error-div" class="alert alert-danger">
        {{ error }}
      </div>
      <div class="group">
        <input
          v-if="registering"
          v-model="name"
          class="first"
          type="text"
          placeholder="Name" />
        <input
          v-model="email"
          :class="{ error: error && !validEmail }"
          type="text"
          placeholder="Email"
          @keyup.enter="loginBtnClicked" />
        <input
          v-model="password"
          class="last"
          :class="{ error: error && !validPass }"
          type="password"
          placeholder="Password"
          @keyup.enter="loginBtnClicked" />
      </div>
      <button id="loginButton" type="button" @click="loginBtnClicked">
        {{ registering ? 'SIGN UP' : 'LOGIN' }}
      </button>
      <a id="signUpLink" href="#" @click="registering = !registering">{{ registering ? 'CANCEL' : 'SIGN UP' }}</a>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: ''
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
    loginBtnClicked: function (event) {
      if (this.registering) {
        this.register()
      } else {
        this.login()
      }
    },
    register: async function () {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      const result = await this.dispatchRegister(data)
      if (result.error) {
        this.error = result.reason
      }
    },
    login: function () {
      this.error = this.validateLogin()
      if (this.error) {
        return
      }

      this.dispatchLogin({ email: this.email, password: this.password })
        .then(result => {
          if (!result.success) {
            this.error = result.reason
          }
        })
    },
    validateLogin: function () {
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
    margin-bottom: 20px;
}

#loginButton {
    width: 100%;
    height: 66px;
    margin-bottom: 10px;
    background-color: #ffffff;
    font-family: 'Rubik', sans-serif;
    color: #212121;
    border: none;

    font-size: 24px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
    border-radius: 5px;

    transition: 0.5s ease;
}
#loginButton:focus {
    outline: none;
}
#loginButton:hover {
    box-shadow: 0 1px 10px 0 rgba(0,0,0,0.37);
}
#signUpLink {
    font-family: 'Rubik', sans-serif;
}

#error-div {
  font-family: 'Rubik', sans-serif;
}
</style>

<style>
.group {
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
    margin-bottom: 20px;
}

input{
    width: 100%;
    font-size: 24px;
    font-family: 'Rubik', sans-serif;
    padding: 15px;
    margin: 0;

    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid #ffffff;

    transition: 300ms ease;
}
input:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}
input:focus {
    outline: none;
    border-bottom: 1px solid #28b5f4;
}
input.error {
    border-bottom: 1px solid #e53635;
}
</style>
