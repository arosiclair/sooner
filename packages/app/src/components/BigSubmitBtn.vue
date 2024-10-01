<template>
  <button
    class="paper-bg btn-lg text-lg shadow-sm rounded p-3"
    type="button"
    :disabled="loading"
    @click="onSubmit"
  >
    <span v-if="loading">
      <b-spinner
        type="grow"
        small
        class="mr-2"
      />
      {{ loadingText }}
    </span>
    <span v-else>
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    onSubmit: {
      type: Function,
      default: () => {}
    },
    label: {
      type: String,
      default: ''
    },
    loading: Boolean,
    loadingText: {
      type: String,
      default: 'Loading...'
    }
  }
}
</script>
