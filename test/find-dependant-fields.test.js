describe('findDependantFields', () => {
  const findDependantFields = require('../lib/find-dependant-fields')
  it('should find all dependant fields', () => {
    const ff = {
      '@type': 'dependant',
      dependsOn: ['k1', 'k2'],
      map: [
        [1, 2, {'@type': 'assigned', value: 'Bob'}],
        [3, 4, {'@type': 'dependant', dependsOn: ['k3'], map: [[5, {'@type': 'void'}]]}]
      ],
      default: {'@type': 'dependant', dependsOn: ['k4'], map: [[6, {'@type': 'void'}]]}
    }
    const fields = findDependantFields('@type', ff)
    expect(fields).toEqual(new Set(['k1','k2','k3','k4']))
  })
})
