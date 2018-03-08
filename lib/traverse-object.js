/**
 * (prevPath: string[], obj: object, callback: Callback) => void
 *
 * // if shouldReturn is true, it will not traverse current value further
 * Callback ~ (path: string[], value: any) => shouldReturn: boolean
 */
module.exports = function traverseObject (prevPath, obj, callback) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const path = prevPath.concat(key)
      if (!callback(path, value)) {
        if (typeof value === 'object' && value !== null) {
          traverseObject(path, value, callback)
        }
      }
    }
  }
}
