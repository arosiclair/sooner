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
      <i class="material-icons done-btn">done</i>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    faviconUrl: function () {
      return 'https://s2.googleusercontent.com/s2/favicons?domain=' + this.data.link
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
    width: 40px;
    height: 40px;
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
