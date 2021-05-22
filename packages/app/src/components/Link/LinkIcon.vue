<template>
  <img
    class="rounded"
    :style="style"
    :srcset="srcset"
    :src="src"
  >
</template>

<script>
import DefaultIcon from '@/assets/linkIcons/globe.png'

export default {
  props: {
    favicons: {
      type: Array,
      default: () => []
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
