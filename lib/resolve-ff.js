const dotProp = require('dot-prop')
const isEqual = require('fast-deep-equal')
const last = require('./last')

// resolve ff into non-dependant ff
module.exports = function resolveFF (ff, typeField, object) {
  while (ff[typeField] === 'dependant') {
    const {
      dependsOn: dependedFields,
      map: cases,
      default: defaultFF = {[typeField]: 'void'}
    } = ff
    const actualValues = dependedFields.map((field) => dotProp.get(object, field, null))
    const matchedCase = cases.find((aCase) => {
      const caseValues = aCase.slice(0, -1)
      return isEqual(caseValues, actualValues)
    })
    ff = matchedCase ? last(matchedCase) : defaultFF
  }
  return ff
}
