<template>
  <div>
    <small-header />
    <div class="d-flex justify-content-center align-items-center">
      <b-icon class="h4 mb-0 mr-3" icon="exclamation-circle-fill" variant="danger" />
      <h5 class="m-0">{{ message }}</h5>
    </div>
  </div>
</template>

<script>
import SmallHeader from './SmallHeader.vue'
export default {
  components: { SmallHeader },
  props: ['message']
}
</script>
