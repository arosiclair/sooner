<template>
  <img
    class="favicon rounded"
    :srcset="srcset"
    :src="src"
  >
</template>

<script>
import DefaultIcon from '@/assets/linkIcons/globe.png'
import api from '../../modules/api'
import { getDomainFromUrl } from '../../modules/utilities'

export default {
  props: {
    linkUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      size: 32,
      sizeMultipliers: [1, 2, 3],
      icons: [],
      fallbackSrc: ''
    }
  },
  computed: {
    sizes () {
      return this.sizeMultipliers.map((multiplier) => multiplier * this.size).join(',')
    },
    srcset () {
      return this.icons.map(icon => `${icon.src} ${icon.xDescriptor}`).join(', ')
    },
    src () {
      if (this.icons[0]) {
        return this.icons[0].src
      } else {
        return this.fallbackSrc || DefaultIcon
      }
    }
  },
  async mounted () {
    try {
      const domainName = getDomainFromUrl(this.linkUrl)
      var resp = await api.get(`/favicon/${domainName}?sizes=${this.sizes}`)
    } catch (error) {
      return
    }

    this.icons = this.mergeIcons(this.initialIcons(), resp.data)

    const fallback = resp.data.fallback
    this.fallbackSrc = fallback ? fallback.src : ''
  },
  methods: {
    initialIcons () {
      const icons = this.sizeMultipliers.map(multiplier => ({ xDescriptor: multiplier + 'x', targetSize: this.size * multiplier }))
      return icons
    },
    mergeIcons (icons, apiIcons) {
      const combinedIcons = []
      icons.forEach(icon => {
        const apiIcon = apiIcons[icon.targetSize]
        if (!apiIcon) return

        combinedIcons.push({
          ...icon,
          ...apiIcon
        })
      })

      combinedIcons.sort((iconA, iconB) => iconA.width - iconB.width)

      return combinedIcons
    }
  }
}
</script>

<style scoped>
.favicon {
  width: 32px;
}

</style>
