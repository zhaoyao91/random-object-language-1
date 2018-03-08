const last = require('./last')

/**
 * // find all dependant fields of this field
 * (typeField: string, ff: FF) => Set<string>
 */
module.exports = function findDependantFields (typeField, ff) {
  if (ff[typeField] !== 'dependant') return new Set()
  const subFFs = ff['map'].map(last)
  if (ff.hasOwnProperty('default')) subFFs.push(ff['default'])
  const fields = new Set(ff['dependsOn'])
  subFFs.forEach((ff) => findDependantFields(typeField, ff).forEach(field => fields.add(field)))
  return fields
}
