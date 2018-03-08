describe('parseFO', () => {
  const parseFO = require('../lib/parse-fo')
  it('should parse FO into nodes and edges', () => {
    const fo = {
      a: {
        b: {
          '@type': 'dependant',
          dependsOn: ['k1', 'k2'],
          map: [
            [1, 2, {'@type': 'assigned', value: 'Bob'}],
            [3, 4, {'@type': 'dependant', dependsOn: ['k3'], map: [[5, {'@type': 'void'}]]}]
          ],
          default: {'@type': 'dependant', dependsOn: ['k4'], map: [[6, {'@type': 'void'}]]}
        }
      },
      c: {
        '@type': 'dependant',
        dependsOn: ['a.b', 'k2', 'k4'],
        map: [
          [1, 2, 3, {'@type': 'void'}],
          [4, 5, 6, {'@type': 'void'}]
        ]
      },
      k1: {'@type': 'void'},
      k2: {'@type': 'void'},
      k3: {'@type': 'void'},
      k4: {'@type': 'assigned', value: 'Bob'}
    }

    const fields = parseFO('@type', fo)

    expect(fields.sort()).toEqual(['a.b', 'c', 'k1', 'k2', 'k3', 'k4'].sort())
    expect(fields.indexOf('k1') < fields.indexOf('a.b'))
    expect(fields.indexOf('k2') < fields.indexOf('a.b'))
    expect(fields.indexOf('k3') < fields.indexOf('a.b'))
    expect(fields.indexOf('k4') < fields.indexOf('a.b'))
    expect(fields.indexOf('a.b') < fields.indexOf('c'))
    expect(fields.indexOf('k2') < fields.indexOf('c'))
    expect(fields.indexOf('k4') < fields.indexOf('c'))
  })
})
