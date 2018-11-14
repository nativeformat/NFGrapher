<img alt="NFGrapher" src="NFGrapher.png" width="100%" max-width="888">

[![CircleCI](https://circleci.com/gh/spotify/NFGrapher.svg?style=svg)](https://circleci.com/gh/spotify/NFGrapher)

A centralized JSON format that describes arbitrary audio playback over time, with generated libraries for TypeScript/JavaScript, C++, Java, Swift, and Python.

# Raison D'être :thought_balloon:

We needed a way to describe a combination of audio sources and effects over time as a single, reproducible experience. A description that could be written regardless of the source language, and played back (read) on multiple player implementations. Even more abstractly, a versioned schema and client libraries to read/write said schema as JSON.

We tried several existing libraries and ecosystems that promised to take a single schema and generate client libraries for multiple languages. There was no library that could singlehandedly fulfill our requirements, so we combined several!

This project is that combination of tools and the code they generate, along with very-specific utilities and nomenclature. It is probably only useful for reading/writing the format it describes, and is not broadly applicable.

# Architecture :triangular_ruler:

[JSON Schema][] is used to describe a format we termed a [Score](doc/nf-score-protocol.md). This schema includes data structures for reading and writing the format.

In the [Score Schema][], there are two top-level concepts: a Score and the ContractDef. The Score represents the format that would be consumed by a player, or written by a producer: an audio graph, with nodes, edges, audio parameters and their commands, and metadata. The ContractDef is a schema that describes structures that describe what specifics can be found in a Score according to a specific Player Contract. A more [thorough explanation](doc/nf-score-protocol.md) might be helpeful to read.

Confused yet? We're just getting started!

[QuickType][] consumes the [Score Schema][], and produces TypeScript types. These ContractDef types are then used by [tools/nf-gen-ts][] to read the [Smart Player Contract][] and generate code for a specific language, like TypeScript or C++. Each language requires a renderer implementation, such as this one for [C++](/tools/nf-gen-ts/src/cppgen).

The [Smart Player Contract][] is a handwritten file that describes the current capabilities and structures that an implementation of the player mentioned above would expect: plugins/audio nodes, parameters, configuration values, and how they all wire up together.

Each generated library is then augmented with handwritten code. An example is [ParamUtil.cpp](cpp/source/param/ParamUtil.cpp). Some of these libraries can then optionally be published to their respective repositories, such as npm for JS.

An advantage of this structure is that when the contract or schema changes, all the libraries can be bumped, [tested with common fixtures](/fixtures), and republished together.

Each supported language has its own folder, tests, and tooling to be as idiomatic to that language as possible (for example, C++ uses CMake for building, while Java uses Maven):

- [C++](/cpp)
- [Java](/java)
- [Swift](/swift)
- [TypeScript](/js)
- [Python](/python)

[JSON Schema]: https://json-schema.org/
[tools/nf-gen-ts]: /tools/nf-gen-ts
[Score Schema]: score-schema.json
[QuickType]: https://github.com/quicktype/quicktype
[Smart Player Contract]: smart-player-contract.json

# Dependencies :globe_with_meridians: & Usage :inbox_tray:

## For Consuming the Generated Libraries (Probably What You Want)

Each language's README specifies which system dependencies are required (if any). For the most part, the libraries are self-contained or dependencies are managed by the language's package manager.

- [C++](/cpp)
- [Java](/java)
- [Swift](/swift)
- [TypeScript / JavaScript](/js)
- [Python](/python)

## For Generating Code / Building (Probably Not What You Want)

The system dependencies to generate code are limited, since the majority of the generation is within the npm/JS ecosystem:

- node >= 8
- npm >= 5.3

But to run tests, which are written in each library's language, a much more sprawling set of dependencies is required (in addition to the above):

- java >= 8
- cmake >= 3.10
- clang 3.8
- python 3
- Swift >= 4.1
- ninja-build
- libcurl
- wget
- git

## Updating the Player Contract

> Note: Updating the smart player [contract](smart-player-contract.json) may have implications regarding compatibility.

To update the contract follow these steps:

1. Read the [Contract Versioning Document][]. It provides steps for how to update the version number when changing the contract and what the implications are.
1. Make your changes.
1. Bump the contract version number according to the [Contract Versioning Document][].
1. Update [kitchen-sink.json](/fixtures/kitchen-sink.json) if necessary.
1. Regenerate code with [`nf-gen-ts`](/tools/nf-gen-ts).
1. Open a PR.

[Contract Versioning Document]: doc/nf-contract-versioning.md

## Releasing

From the master branch, run:

```sh
$ tools/scripts/cut-release.sh --systems-go
```

This will, eventually, create a version tag and push it to Github, which will kick off a release build that requires manual approval in the CircleCI UI.

# Contributing :mailbox_with_mail:

Contributions are welcomed, please open a PR or better, an issue before you do a ton of work!

This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.

[code-of-conduct]: https://github.com/spotify/code-of-conduct/blob/master/code-of-conduct.md

# License :memo:
The project is available under the [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) license.

# Acknowledgements

- Icon in README banner is [Cassette](https://thenounproject.com/search/?q=audio%20graph&i=235720) by Saeed Farrahi from the Noun Project.

## Contributors

* [Jose Falcon](https://github.com/josefalcon)
* [Justin Windle](https://github.com/soulwire)
* [Noah Hilt](https://github.com/noeski)
* [Drew Petersen](https://github.com/kirbysayshi)
* [Julia Cox](https://github.com/astrocox)
* [Will Sackfield](https://github.com/8W9aG)
* [Justin Sarma](https://github.com/jsarma)
* [David Rubinstein](https://github.com/drubinstein)