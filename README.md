# Random Object Language

JS Implementation of [Random Object Language](https://github.com/zhaoyao91/random-object-language).

* Version: 2.0.0
* Based on: [Random Object Language 0.6.1](https://github.com/zhaoyao91/random-object-language)

## Usage

```
npm i random-object-language
```

```ecmascript 6
const buildGenerator = require('random-object-language')

const fo = {
  f1: {'@type': 'enum', values: [1, 2]}  
}

const generate = buildGenerator(fo)

const obj = await generate()

// obj is {f1: 1} or {f1: 2}
```

## API

This package expose a function `buildGenerator`

### buildGenerator

```
(FO, Options?) => Generator

FO ~ https://github.com/zhaoyao91/random-object-language#free-object-fo

Options ~ {
  typeField: string? = '@type',
  generators: {
    assigned: FFGenerator?,
    number: FFGenerator?,
    enum: FFGenerator?,
  }?
}

FFGenerator ~ ({FF, typeField: string, path: string, object}) => promise => any

Generator ~ () => promise => object
```

## License

MIT