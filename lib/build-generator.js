const dotProp = require('dot-prop')
const parseFO = require('./parse-fo')
const defaultGenerators = require('./default-generators')
const resolveFF = require('./resolve-ff')

/**
 * (fo: FO, options: {typeField: string?, generators: FFGenerator[]?}?) => Generator
 *
 * FFGenerator ~ ({ff, typeField, path, object}) => promise => any
 *
 * Generator ~ () => promise => object
 */
module.exports = function buildGenerator (fo, options) {
  const typeField = dotProp.get(options, 'typeField', '@type')
  const generators = {
    ...defaultGenerators,
    ...dotProp.get(options, 'generators')
  }
  const fields = parseFO(typeField, fo)
  return async function generator () {
    const object = {}
    const virtualFields = []

    // generate values
    for (let field of fields) {
      let ff = dotProp.get(fo, field)
      ff = resolveFF(ff, typeField, object)
      const type = ff[typeField]
      if (type !== 'void') {
        const value = await generators[type]({ff, typeField, path: field, object})
        dotProp.set(object, field, value)
        if (ff['virtual']) virtualFields.push(field)
      }
    }

    // remove virtual fields
    virtualFields.forEach(field => dotProp.delete(object, field))

    return object
  }
}
