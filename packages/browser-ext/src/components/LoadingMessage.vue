<template>
  <div class="p-2 d-flex justify-content-center align-items-center">
    <b-spinner class="mr-3" show/>
    <h5 class="mb-0">{{ message }}</h5>
  </div>
</template>

<script>
export default {
  props: ['message']
}
</script>
