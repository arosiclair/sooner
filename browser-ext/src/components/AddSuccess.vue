<template>
  <div>
    <small-header />
    <div class="d-flex justify-content-center align-items-center">
      <b-icon class="h4 mb-0 mr-3" icon="check-circle-fill" variant="success" />
      <h5 class="mb-0"> Page added!</h5>
    </div>
  </div>
</template>

<script>
import SmallHeader from './SmallHeader.vue'
export default {
  components: { SmallHeader }
}
</script>
