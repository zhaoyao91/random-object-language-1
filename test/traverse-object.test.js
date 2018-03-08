describe('traverseObject', function () {
  const traverseObject = require('../lib/traverse-object')
  it('should traverse object correctly', () => {
    const obj = {
      name: 'Bob',
      age: 18,
      friend: {
        name: 'Alice'
      },
      house: {
        price: 100
      }
    }

    const keys = []
    const values = []
    traverseObject([], obj, (path, value) => {
      keys.push(path.join('.'))
      values.push(value)
      if (path.join('.') === 'house') return true
    })

    const expectedKeys = [
      'name',
      'age',
      'friend',
      'friend.name',
      'house'
    ]

    const expectedValues = [
      'Bob',
      18,
      {name: 'Alice'},
      'Alice',
      {price: 100}
    ]

    expect(keys).toEqual(expectedKeys)
    expect(values).toEqual(expectedValues)
  })
})