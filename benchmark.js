const buildGenerator = require('./index')
const measure = require('measure-function-time')

const fo = {
  'field_1': {
    '@type': 'assigned',
    'value': 'some concrete value'
  },
  'field_2': {
    '@type': 'number',
    'integer': true,
    'range': {'gt': 1, 'lte': 10}
  },
  'field_3': {
    'field_3_1': {
      '@type': 'enum',
      'values': [1, 3, 'Bob', {'name': 'Alice'}],
      'weights': [2, 2, 1, 4]
    }
  },
  'field_4': {
    '@type': 'dependant',
    'dependsOn': ['field_2', 'field_3.field_3_1'],
    'map': [
      [1, 1, {'@type': 'number', 'range': {'gte': 2, 'lt': 9}}],
      [2, 2, {'@type': 'enum', 'values': ['a', 'b', 'c']}],
      [3, 'Bob', {'@type': 'assigned', 'value': 'God'}],
      [4, {'name': 'Alice'}, {'@type': 'enum', 'values': ['Boy', 'Girl']}]
    ],
    'default': {'@type': 'void'}
  }
}

measure.async(async () => {
  const objs = []
  const generate = buildGenerator(fo)
  for (let i = 0; i < 100000; i++) {
    objs.push(await generate())
  }
  console.log(objs)
}).then(console.log).catch(console.error)

