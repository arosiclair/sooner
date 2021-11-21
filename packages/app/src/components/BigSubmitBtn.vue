<template>
  <button
    class="paper-bg btn-lg text-lg shadow-sm rounded p-3"
    type="button"
    :disabled="loading"
    @click="onSubmit"
  >
    <b-spinner v-if="loading" />
    <span v-else>
      {{ label }}
    </span>
  </button>
</template>

<script>
export default {
  props: [
    'onSubmit',
    'loading',
    'label'
  ]
}
</script>
