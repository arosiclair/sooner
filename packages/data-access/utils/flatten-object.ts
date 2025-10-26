/* eslint-disable no-prototype-builtins */

// taken from https://gist.github.com/penguinboy/762197
export default function flattenObject(obj: Record<string, unknown> | null) {
  if (obj === null) {
    return {};
  }

  let result: Record<string, any> = {}

  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) continue

    const value = obj[i];
    if ((typeof value) === 'object') {
      let flatObject = flattenObject(value as Record<string,unknown>)
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue

        result[i + '.' + x] = flatObject[x]
      }
    } else {
      result[i] = value
    }
  }
  return result
}
