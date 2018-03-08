const traverseObject = require('./traverse-object')
const findDependantFields = require('./find-dependant-fields')
const toposort = require('toposort')

/**
 * // parse FO into topologically sorted fields (full keys)
 * // if a depends on b, then b will be closer to the top than a
 * (typeField: string, fo: FO) => fields: string[]
 */
module.exports = function parseFO (typeField, fo) {
  const nodes = []
  const edges = []
  const isFF = (value) => typeof value === 'object' && value !== null && value.hasOwnProperty(typeField)
  traverseObject([], fo, (path, value) => {
    if (isFF(value)) {
      const ff = value
      const fullKey = path.join('.')
      nodes.push(fullKey)
      const fields = findDependantFields(typeField, ff)
      edges.push(...Array.from(fields).map(field => [fullKey, field]))
      return true
    }
  })
  return toposort.array(nodes, edges).reverse()
}
