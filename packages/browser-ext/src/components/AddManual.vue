<template>
  <div>
    <small-header />
    <h5 class="text-center">
      🙁 Sorry, we couldn't lookup this page's details.
    </h5>
    <h5 class="text-center">
      Please enter them manually
    </h5>
    <form>
      <div class="paper-bg shadow-sm rounded overflow-hidden mb-2">
        <input
          v-model="title"
          type="text"
          placeholder="Title"
          class="lg"
          :class="{ error: error && !validEmail }"
          @keyup.enter="submit"
        >
        <input
          v-model="site"
          type="text"
          placeholder="Site"
          class="lg"
          :class="{ error: error && !validPass }"
          @keyup.enter="submit"
        >
      </div>
      <button
        class="shadow-sm rounded p-2 mb-2"
        type="button"
        :disabled="!canSubmit"
        @click="submit"
      >
        <b-spinner v-if="loading" />
        <span v-else>Submit</span>
      </button>
    </form>
  </div>
</template>

<script>
import { addLink } from '../api'
import { RouteNames } from '../popup/router'
import SmallHeader from './SmallHeader.vue'

export default {
  components: { SmallHeader },
  props: ['url', 'tabTitle', 'tabDomain'],
  data () {
    return {
      title: this.$props.tabTitle,
      site: this.$props.tabDomain,
      loading: false
    }
  },
  computed: {
    validTitle () {
      return this.title.length
    },
    validSiteName () {
      return this.site.length
    },
    canSubmit () {
      return !this.loading && this.validTitle && this.validSiteName
    }
  },
  methods: {
    async submit () {
      try {
        this.loading = true
        const result = await addLink(this.$props.url, this.title, this.site)
        this.$router.push({ name: RouteNames.AddSuccess, params: { linkId: result.data.linkId } })
      } catch (error) {
        this.$router.push({ name: RouteNames.AddFailed, params: { message: 'Sorry, there was an issue saving this page' } })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 0.8rem;
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

button {
  width: 100%;
  background-color: #ffffff;
  border: none;
  transition: 0.5s ease;
}
button:focus {
    outline: none;
}
button:hover {
    box-shadow: 0 .25rem 0.5rem rgba(0,0,0,.15)!important;
}
</style>
