import { addLink } from './api'

browser.contextMenus.create({
  id: 'add-link-to-sooner',
  title: 'Add to Sooner',
  contexts: ['link']
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'add-link-to-sooner') {
    const linkUrl = info.linkUrl
    console.log('[sooner-ext] context menu link: ' + linkUrl)

    try {
      addLink(linkUrl)
    } catch (error) {
      console.error('[sooner-ext] failed to add a link')
    }
  }
})
