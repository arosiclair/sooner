<template>
  <img :src="iconUrl">
</template>

<script>
import DefaultIcon from '@/assets/linkIcons/globe.png'
import TheVergeIcon from '@/assets/linkIcons/theverge.png'
import NYTIcon from '@/assets/linkIcons/nytimes.png'
import CNNIcon from '@/assets/linkIcons/cnn.png'

export default {
  props: {
    linkUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconUrl () {
      if (this.linkUrl.includes('theverge')) {
        return TheVergeIcon
      } else if (this.linkUrl.includes('nytimes')) {
        return NYTIcon
      } else if (this.linkUrl.includes('cnn')) {
        return CNNIcon
      } else {
        return DefaultIcon
      }
    }
  }
}
</script>
