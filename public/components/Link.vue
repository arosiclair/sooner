<template>
  <div class="centered-container split item">
    <div class="centered-container">
      <img class="favicon" :src="faviconUrl" alt="" />
      <div>
        <h3>{{ data.name }}</h3>
        <a :href="data.link">{{ data.link }}</a>
      </div>
    </div>
    <div>
      <i class="material-icons done-btn" @click="remove">done</i>
    </div>
  </div>
</template>

<script>
import api from '../js/api'

export default {
  props: ['data'],
  computed: {
    faviconUrl: function () {
      return 'https://favicons.githubusercontent.com/' + this.data.link
    }
  },
  methods: {
    remove: async function () {
      var data = {
        linkId: this.data._id
      }

      await api.post(API_URL + '/list/remove', data)
      this.$emit('list-updated')
    }
  }
}
</script>

<style scoped>
div {
    text-align: start;
}

.centered-container {
    display: flex;
    align-items: center;
}

.split {
    justify-content: space-between;
}

.item {
    background-color: #ffffff;
    font-family: 'Rubik', sans-serif;
    width: 100%;
    padding: 15px;
    margin: 0;
}
.item:hover {
    background-color: #eeeeee;
}

.favicon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
}
h3 {
    font-size: 20px;
    margin-bottom: 0px;
}

a {
    font-size: 14px;
    color: #c7c7c7;
}

.done-btn {
    color: #c7c7c7;
    font-size: 30px;
    padding: 0 10px;
    cursor: pointer;
}
.done-btn:hover {
    color: #28b5f4;
}
</style>
