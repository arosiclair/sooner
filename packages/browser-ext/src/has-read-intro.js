import browser from 'webextension-polyfill'

const KEY = 'HAS_READ_INTRO'

export const hasReadIntro = async () => {
  try {
    const results = await browser.storage.local.get(KEY)
    return results[KEY]
  } catch (error) {
    console.error(error)
    return false
  }
}

export const setHasReadIntro = async (value) => {
  try {
    await browser.storage.local.set({
      [KEY]: value
    })
  } catch (error) {
    console.error(error)
  }
}
