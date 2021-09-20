<template>
  <div class="reqs-container p-3 rounded">
    <h5 class="text-center">
      Password Requirements
    </h5>
    <ul
      class="m-0 pl-4"
      :class="{ 'text-danger': error }"
    >
      <li :class="{ 'text-success': lengthInRange }">
        <password-reqs-status-icon
          :valid="lengthInRange"
          :error="error"
          class="mr-1"
        />
        Between 8 and 32 characters
      </li>
      <li :class="{ 'text-success': containsLower }">
        <password-reqs-status-icon
          :valid="containsLower"
          :error="error"
          class="mr-1"
        />
        At least one lowercase letter
      </li>
      <li :class="{ 'text-success': containsUpper }">
        <password-reqs-status-icon
          :valid="containsUpper"
          :error="error"
          class="mr-1"
        />
        At least one uppercase letter
      </li>
      <li :class="{ 'text-success': containsNumber }">
        <password-reqs-status-icon
          :valid="containsNumber"
          :error="error"
          class="mr-1"
        />
        At least one number
      </li>
      <li :class="{ 'text-success': containsSymbol }">
        <password-reqs-status-icon
          :valid="containsSymbol"
          :error="error"
          class="mr-1"
        />
        At least one symbol
      </li>
    </ul>
  </div>
</template>

<script>
import PasswordReqsStatusIcon from './PasswordReqsStatusIcon.vue'
export default {
  components: { PasswordReqsStatusIcon },
  props: {
    error: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: ''
    }
  },
  computed: {
    lengthInRange () {
      return this.password.length >= 8 && this.password.length <= 32
    },
    containsLower () {
      return this.password.toUpperCase() !== this.password
    },
    containsUpper () {
      return this.password.toLowerCase() !== this.password
    },
    containsNumber () {
      return /\d/.test(this.password)
    },
    containsSymbol () {
      return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(this.password)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/bootstrap.scss';

.reqs-container {
  text-align: start;
}

ul {
  list-style-type: none;
}

</style>
