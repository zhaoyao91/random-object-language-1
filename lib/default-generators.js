const random = require('lodash.random')
const weighted = require('weighted')

function assignedGenerator ({ff, typeField, path, object}) {
  return ff.value
}

function numberGenerator ({ff, typeField, path, object}) {
  const {integer, range} = ff
  const {gt, gte, lt, lte} = range

  const min = gte || (integer ? gt + 1 : gt)
  const max = lte || (integer ? lt - 1 : lt)

  return random(min, max, !integer)
}

function enumGenerator ({ff, typeField, path, object}) {
  let {values, weights = []} = ff

  // correct weights length
  if (weights.length > values.length) weights = weights.slice(0, values.length)
  else if (weights.length < values.length) weights = Object.assign(Array(values.length).fill(1), weights)

  return weighted.select(values, weights)
}

module.exports = {
  assigned: assignedGenerator,
  number: numberGenerator,
  enum: enumGenerator,
}