<template>
  <div class="p-2 d-flex align-items-center">
    <b-spinner
      type="grow"
      small
      class="mr-3"
    />
    <h5 class="mb-0">
      {{ message }}
    </h5>
  </div>
</template>

<script>
export default {
  props: ['message']
}
</script>
