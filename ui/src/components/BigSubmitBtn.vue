<template>
  <button class="btn-lg text-lg shadow-sm rounded p-3" type="button" @click="onSubmit" :disabled="loading">
    <b-spinner v-if="loading"/>
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
