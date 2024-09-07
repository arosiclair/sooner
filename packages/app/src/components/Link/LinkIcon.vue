<template>
  <span
    v-if="tutorial"
    :style="style"
    class="tutorial-icon-container"
  >
    <link-tutorial-icon
      :favicons="favicons"
    />
  </span>

  <img
    v-else
    class="rounded"
    :style="style"
    :srcset="srcset"
    :src="src"
  >
</template>

<script>
import DefaultIcon from '@/assets/linkIcons/globe.png'
import LinkTutorialIcon from './LinkTutorialIcon.vue'

export default {
  components: { LinkTutorialIcon },
  props: {
    favicons: {
      type: Array,
      default: () => []
    },
    tutorial: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      size: 32,
      sizeMultipliers: [1, 2, 3]
    }
  },
  computed: {
    style () {
      return `width: ${this.size}px`
    },
    initialIcons () {
      return this.sizeMultipliers.map(multiplier => (
        {
          xDescriptor: multiplier + 'x',
          targetSize: this.size * multiplier
        }))
    },
    targetIcons () {
      return this.initialIcons.map(icon => {
        const closestIcon = this.findClosestIcon(icon.targetSize)
        if (closestIcon) {
          return {
            ...icon,
            ...closestIcon
          }
        } else {
          return null
        }
      }).filter(Boolean)
    },
    srcset () {
      return this.targetIcons.map(icon => `${icon.src} ${icon.xDescriptor}`).join(', ')
    },
    src () {
      if (this.targetIcons.length) {
        return this.targetIcons[this.targetIcons.length - 1].src
      } else {
        const fallbackIcon = this.findLargestIcon()
        return fallbackIcon ? fallbackIcon.src : DefaultIcon
      }
    }
  },
  methods: {
    findClosestIcon (targetSize) {
      if (!this.favicons || !this.favicons.length) return null

      let closestIcon = null
      let closestDiff = Number.MAX_VALUE

      this.favicons.forEach(icon => {
        if (!icon.width) return

        const diff = Math.abs(targetSize - icon.width)

        if (!closestIcon || closestDiff > diff) {
          closestIcon = icon
          closestDiff = diff
        }
      })

      return closestIcon
    },
    findLargestIcon () {
      if (!this.favicons || !this.favicons.length) return null

      return this.favicons.reduce((a, b) => {
        if (!a.width) return b
        else if (!b.width) return a
        else return a.width > b.width ? a : b
      })
    }
  }
}
</script>

<style scoped>
.tutorial-icon-container {
  text-align: center;
}
</style>
