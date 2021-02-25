import { addLink, logout } from './api'

browser.contextMenus.create({
  id: 'add-link-to-sooner',
  title: 'Add to Sooner',
  contexts: ['link']
})

browser.contextMenus.create({
  id: 'go-to-sooner',
  title: 'Go to Sooner',
  contexts: ['browser_action']
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
    case 'go-to-sooner':
      window.open('https://www.sooner.app/list')
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
