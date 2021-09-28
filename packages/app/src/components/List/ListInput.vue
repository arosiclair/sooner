<template>
  <div
    class="box paper-bg shadow-sm rounded overflow-hidden"
  >
    <input
      v-model="url"
      placeholder="Enter a link here"
      type="text"
      class="lg"
      :class="{ error }"
      @input="onUrlChanged"
    >
    <TransitionHeight appear>
      <div :key="showPreview">
        <div
          v-if="showPreview"
          class="preview-container px-3 py-2 text-left"
        >
          <b-spinner v-if="loading" />
          <div
            v-else
            class="centered-container split"
          >
            <div class="text-lg">
              {{ titlePreview }}
            </div>
            <div
              role="button"
              @click="submitLink"
            >
              <i class="material-icons actionable">add_circle_outline</i>
            </div>
          </div>
        </div>
      </div>
    </TransitionHeight>
  </div>
</template>

<script>
import api from '../../modules/api'
import { debounce } from '../../modules/utilities'
import TransitionHeight from '../utils/TransitionHeight.vue'

export default {
  components: { TransitionHeight },
  data () {
    return {
      url: '',
      error: false,
      loading: false,
      metadata: null
    }
  },

  computed: {
    titlePreview () {
      return this.metadata ? this.metadata.title : ''
    },
    showPreview () {
      return this.titlePreview || this.loading
    }
  },

  methods: {
    onUrlChanged: debounce(async function (event) {
      this.loading = true
      this.metadata = await this.getMetadata(this.url)
      this.loading = false
    }, 750),

    async getMetadata (url) {
      if (!url.trim()) {
        this.error = true
        return null
      }

      try {
        var response = await api.get('/metadata?url=' + url.trim())
      } catch (error) {
        this.error = true
        if (!error.response) {
          this.$toast.error('There was an issue getting info on your link')
        }
        return null
      }

      this.error = false
      return response.data
    },

    async submitLink () {
      const url = this.url.trim()
      if (!url) {
        this.error = true
        return
      }

      try {
        await api.post('/list/', { url })
      } catch (error) {
        this.error = true
        if (error.response.status === 401) {
          this.$toast.error('Your session expired')
        } else {
          this.$toast.error('There was an issue adding your link')
        }
      }

      this.url = ''
      this.error = false
      this.metadata = null

      this.$emit('link-added')
    }
  }
}
</script>

<style>
</style>
