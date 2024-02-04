<template>
  <div
    id="input-container"
    class="box paper-bg shadow-sm rounded overflow-hidden d-flex"
  >
    <input
      v-model="url"
      placeholder="Enter a link here"
      type="text"
      class="lg pr-5"
      :class="{ error }"
      @input="onUrlChanged"
    >
    <span
      id="spinner-container"
      class="mx-3"
      :class="{ hidden: !loading }"
    >
      <b-spinner
        type="grow"
        small
      />
    </span>
  </div>
</template>

<script>
import api from '../../modules/api'
import { debounce } from '../../modules/utilities'

export default {
  data () {
    return {
      url: '',
      error: false,
      loading: false
    }
  },

  methods: {
    onUrlChanged: debounce(async function (event) {
      const loadingTimeout = setTimeout(() => {
        this.loading = true
      }, 750)

      await this.submit(this.url)

      clearTimeout(loadingTimeout)
      this.loading = false
    }, 750),

    async submit () {
      const url = this.url.trim()
      if (!url) {
        this.error = true
        return
      }

      try {
        await api.post('/list', { url })
      } catch (error) {
        this.error = true

        if (error.response) {
          if (error.response.status === 400) {
            this.error = true
          } else if (error.response.status === 401) {
            this.$toast.error('Your session expired')
          }
        } else {
          this.$toast.error('There was an issue adding your link')
        }

        return
      }

      this.url = ''
      this.error = false
      this.$emit('link-added')
    }
  }
}
</script>

<style lang="scss" scoped>
#input-container {
  position: relative;
}

#spinner-container {
  position: absolute;
  top: calc(50% - 12px);
  right: 0;

  opacity: 1;
  &.hidden {
    opacity: 0;
  }
}
</style>
