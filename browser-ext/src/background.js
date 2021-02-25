import { addLink, logout } from './api'

browser.contextMenus.create({
  id: 'add-link-to-sooner',
  title: 'Add to Sooner',
  contexts: ['link']
})

browser.contextMenus.create({
  id: 'logout',
  title: 'Log out',
  contexts: ['browser_action']
})

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'add-link-to-sooner':
      console.log('[sooner-ext] context menu link: ' + info.linkUrl)
      try {
        await addLink(info.linkUrl)
      } catch (error) {
        console.error('[sooner-ext] failed to add a link')
      }
      break
    case 'logout':
      try {
        await logout()
      } catch (error) {
        console.error('[sooner-ext] failed to logout')
      }
      break
  }
})
