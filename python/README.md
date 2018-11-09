# nf-grapher-python

This is a Python3 library for building Native Format Scores.

> **Note**: Currently this library supports _building_ Native Format Scores for the Native Format Smart Player, however reading or deserializing scores from JSON is currently unsupported.

## Requirements

- Python3
- virtualenv

## Installing

```bash
pip install nf_grapher
```

## Getting Started

Setup a virtual environment with the following:

```bash
virtualenv -p python3 e
source ./e/bin/activate
```

You can use whatever environment name you'd like, `e` is used here because it's short.

## Structure

This python library is divided into 3 modules. `nf_grapher.score` contains all the Score level objects
defined by the Native Format Score schema. `nf_grapher.typed` contains useful "typed" nodes defined
by the [smart player contract](../smart-player-contract.json). Because Python is not
statically typed, these types are not yet enforced. `nf_grapher.encoder` contains a function `encode`
for serializing grapher objects into JSON.

## Tests

Run tests with the following command:

```bash
python -m unittest discover -v
```

## Example Usage

```python
from nf_grapher.score import *
from nf_grapher.typed import *
from nf_grapher.encoder import encode

# Build a source node for a Spotify track
# Start from 5.6 seconds into the track and play for 5.6 seconds
source = FileNode('spotify:track:4RDKrwyA9YouzL1LxvMaxH', offset=5.6e+9, duration=5.6e+9)

# Create a 5.6 second loop from the beginning of the track
loop = LoopNode(when=0, duration=5.6e+9)

# Create the full score
score = Score(Graph(
    nodes=[source, loop],
    edges=[source.connect(loop)]
))

print(encode(score))
```

You can see a list of all supported typed nodes by using the Python `help` feature in a REPL.
For instance,

```bash
python
>>> from nf_grapher import typed
>>> help(typed)
```
