const buildGenerator = require('../lib/build-generator')
const isEqual = require('lodash.isequal')

describe('buildGenerator', () => {
  it('should build a void field', async () => {
    const fo = {
      f1: {'@type': 'void'}
    }
    const generate = buildGenerator(fo)
    const obj = await generate()
    expect(obj).toEqual({})
  })

  it('should build an obj with assigned field', async () => {
    const fo = {
      f1: {'@type': 'assigned', value: 'Bob'}
    }
    const generate = buildGenerator(fo)
    const obj = await generate()
    expect(obj).toEqual({f1: 'Bob'})
  })

  it('should build an obj with number field', async () => {
    const fo = {
      f1: {'@type': 'number', range: {gt: 1, lt: 10}}
    }
    const generate = buildGenerator(fo)
    const objs = await Promise.all(Array(100).fill(0).map(generate))
    objs.forEach(obj => {
      expect(obj.f1).toBeGreaterThan(1)
      expect(obj.f1).toBeLessThan(10)
    })
    expect(objs[0]).not.toEqual(objs[1])
  })

  it('should build an obj with integer field', async () => {
    const fo = {
      f1: {'@type': 'number', integer: true, range: {gt: 1, lt: 10}}
    }
    const generate = buildGenerator(fo)
    const objs = await Promise.all(Array(100).fill(0).map(generate))
    objs.forEach(obj => {
      expect(Number.isInteger(obj.f1)).toBe(true)
      expect(obj.f1).toBeGreaterThan(1)
      expect(obj.f1).toBeLessThan(10)
    })
  })

  it('should build an obj with integer field (gte, lte)', async () => {
    const fo = {
      f1: {'@type': 'number', integer: true, range: {gte: 1, lte: 10}}
    }
    const generate = buildGenerator(fo)
    const objs = await Promise.all(Array(100).fill(0).map(generate))
    objs.forEach(obj => {
      expect(Number.isInteger(obj.f1)).toBe(true)
      expect(obj.f1).toBeGreaterThanOrEqual(1)
      expect(obj.f1).toBeLessThanOrEqual(10)
    })
    expect(objs.some(obj => obj.f1 === 1)).toBe(true)
    expect(objs.some(obj => obj.f1 === 10)).toBe(true)
  })

  it('should build an obj with enum field', async () => {
    const fo = {
      f1: {
        '@type': 'enum',
        values: [1, 'Bob', {age: 20}],
        weights: [3, 2]
      }
    }
    const generate = buildGenerator(fo)
    const objs = await Promise.all(Array(100).fill(0).map(generate))
    expect(objs.some(obj => obj.f1 === 1)).toBe(true)
    expect(objs.some(obj => obj.f1 === 'Bob')).toBe(true)
    expect(objs.some(obj => isEqual(obj.f1, {age: 20}))).toBe(true)
    expect(objs.filter(obj => obj.f1 === 1).length > objs.filter(obj => obj.f1 === 'Bob').length).toBe(true)
    expect(objs.filter(obj => obj.f1 === 'Bob').length > objs.filter(obj => isEqual(obj.f1, {age: 20})).length).toBe(true)
  })

  it('should build an obj with some dependant fields', async () => {
    const fo = {
      f1: {
        '@type': 'enum',
        values: [1, 2]
      },

      f2: {
        f1: {
          '@type': 'enum',
          values: ['a', 'b']
        },

        f2: {
          '@type': 'dependant',
          dependsOn: ['f1'],
          map: [
            [1, {'@type': 'assigned', value: 11}],
            [2, {'@type': 'assigned', value: 22}]
          ]
        }
      },

      f3: {
        '@type': 'dependant',
        dependsOn: ['f2.f1', 'f2.f2'],
        map: [
          ['a', 11, {'@type': 'assigned', value: 111}],
          ['b', 22, {'@type': 'assigned', value: 222}]
        ],
        default: {'@type': 'enum', values: [333, 444]}
      }
    }
    const generate = buildGenerator(fo)
    const objs = await Promise.all(Array(100).fill(0).map(generate))
    expect(objs.some(obj => isEqual(obj, {
      f1: 1,
      f2: {
        f1: 'a',
        f2: 11
      },
      f3: 111
    }))).toBe(true)
    expect(objs.some(obj => isEqual(obj, {
      f1: 2,
      f2: {
        f1: 'b',
        f2: 22
      },
      f3: 222
    }))).toBe(true)
    expect(objs.some(obj => isEqual(obj, {
      f1: 1,
      f2: {
        f1: 'b',
        f2: 11
      },
      f3: 333
    }))).toBe(true)
    expect(objs.some(obj => isEqual(obj, {
      f1: 2,
      f2: {
        f1: 'a',
        f2: 22
      },
      f3: 444
    }))).toBe(true)
    expect(objs.some(obj => isEqual(obj, {
      f1: 1,
      f2: {
        f1: 'b',
        f2: 22
      },
      f3: 222
    }))).toBe(false)
  })

  it('should generate an obj without virtual fields', async () => {
    const fo = {
      f1: {
        '@type': 'enum',
        values: [1, 2],
        virtual: true
      },
      f2: {
        '@type': 'dependant',
        dependsOn: ['f1'],
        map: [
          [1, {'@type': 'assigned', value: 11}],
          [2, {'@type': 'assigned', value: 22}],
        ]
      }
    }
    const generate = buildGenerator(fo)
    const obj = await generate()
    expect(
      isEqual(obj, {f2: 11}) ||
      isEqual(obj, {f2: 22})
    ).toBe(true)
  })

  it('should use type@ as type field', async () => {
    const fo = {
      f1: {'type@': 'assigned', value: 1}
    }
    const generate = buildGenerator(fo, {typeField: 'type@'})
    const obj = await generate()
    expect(obj).toEqual({f1: 1})
  })
})