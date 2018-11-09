# nf-gen-ts

A code generator for Grapher based on the Smart Player [contract][].

## Dependencies

* [node](https://nodejs.org/en/) (version 7+)
* [python](https://www.python.org/) (version 3+)
* [java](https://java.com/en/download/) (version 8+)

## Supported Languages

* C++
* Java
* TypeScript
* Python
* Markdown Documentation

## Usage

A command line tool is available for generating code. First, install all project dependencies with

```bash
npm install
```

You can see the full list of options by running

```bash
npm run generate -- --help
```

To quickly generate code to the default location, run one of the following:

```sh
npm run generate:java
npm run generate:cpp
npm run generate:typescript
npm run generate:python
npm run generate:doc
```

Generate everything with

```sh
npm run generate:all
```

## How it Works

The command line tool reads the current [JSONSchema](../../score-schema.json) and generates Typescript interfaces with [quicktype][] to `src/defs.generated.ts`. The generated interfaces are used to read and interpret the [contract][] in a strongly-typed fashion.

Each language generator can be found in a `*gen` directory in the `src` folder. Generators are functions with the type:

```typescript
type Renderer = (
  contractDef: ContractDef,
  scoreSchema?: any
) => Promise<OutputFile[]>;
```

where `contractDef` contains a typed version of the contract, and `scoreSchema` contains a JSON object representing the score schema itself.

### Adding a new Generator

1.  Create a new `*gen` directory in `src`.
2.  Write and export a render function.
3.  Update [index.ts](./src/index.ts) so that the `renderers` map contains your new function.
4.  Run your generator by running `npm run generate -- -l <lang>`

[quicktype]: https://github.com/quicktype/quicktype
[contract]: ../../smart-player-contract.json
