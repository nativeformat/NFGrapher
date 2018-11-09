Score Level Protocol
--------------------

The score level protocol defines the JSON representation of a Native Format Score to be rendered by the Smart Player. It is defined as a [JSON schema](../score-schema.json).

The protocol is designed to be human-readable, simple, and generic enough to represent plugins that don't yet exist. Structurally it is similar to what exists today, but with some minor improvements.

A `score` is a `graph` and a `version` number.

A `graph` is a collection of `nodes` and `edges`. It represents the "audio graph" of operations and relationships for what is to be rendered into audio.

An `edge` is a directed relationship between a source node and target node. An edge should be used to describe a source node feeding audio data into a target node. Edges have been pared-down from the original format to only include, id, source, and target fields.

A `node` represents the instantiation of a plugin in the Smart Player. For instance, a "gain node" defines the `kind` of plugin to create, "com.nativeformat.plugins.waa.gain", and all of the commands to be executed that manipulate the plugin's state.

A node may set `config` values, read only data required for plugin instantiation. For example, the file plugin requires knowing from which file to read data. Config values *cannot* be changed at render time.

A node's manipulable state is represented with `params`. For example, the stretch plugin has two params: `pitchRatio` and `stretch`. The loop plugin has a param called `loopCount`. Param values *can* change at render time, and changes are specified with a list of `commands`.

A `command` is a name and a map of `args`.

An argument or config value is represented as a JSON value, and must be one of the following:

|  **Name**   | **Description** |
|  ---------- | ---------------------------------------------------------- |
|  `string`     | A string |
|  `int`        | An integer, represented as a long |
|  `float`      | A floating point number, represented as a double |
|  `bool`       | A boolean |
|  `time`       | Nanoseconds, represented as a long |
|  `list`(\*)   | Where \* is any name above. Represents a list of the given type. Lists must be homogeneous. |

#### A Note on Structure

It is worth noting that the score level schema defines structure. Many structurally valid score messages are meaningless to the Smart Player. For instance, if a node's kind property specifies a plugin not yet supported by the player, or if a param contains a command not relevant to its type, the Smart Player may choke on the message or have unexpected behaviour. Thus, in and of itself, the score level protocol is not very useful to a programmer because they must know the additional constraints defined by the player, and these additional constraints are nowhere defined in this schema.

### Examples

A node with a gain param:

```json
{
  "id": "f64903d9-a6c2-43bf-88ff-eb03c6b1c2d3",
  "kind": "com.nativeformat.plugins.waa.gain",
  "params": {
    "gain": [
      {
        "name": "setValueAtTime",
        "args": {
          "value": 1.2,
          "startTime": 1000000
        }
      }
    ]
  }
}
```

A node with config:

```json
{
  "id": "0b8060fc-e873-47d8-932c-d288b21fb277",
  "kind": "com.nativeformat.plugin.file.file",
  "config": {
    "file": "https://example.com",
    "when": 1000,
    "duration": 1000,
    "offset": 1000
  }
}
```

Smart Player Protocol
---------------------

##### Note: We sometimes call this the 'High Level Protocol' or the 'contract'

Where the score level protocol defines structural validity, the goal of the smart player protocol is to define semantic validity, or a contract as to what may be in a score message. And while the score level protocol is generic, the intent of the smart player protocol is to specify the capabilities and constraints of the Native Format Smart Player.

First, let's define a structure so that we can define our contract as data. It starts to get confusing here because we define that structure as a [JSON schema](../score-schema.json#L185). And the *thing* represented by that schema is\...well\...a schema. So let's call it a Contract.

A `ContractDef` is a collection of `pluginDefs` and `paramKindDefs`. A `ContractDef` defines graph validity, that is, it can be thought of as describing a function accepting a graph as an argument and returning true or false depending on if the graph respects its `pluginDef` and `paramKindDefs`.

A `pluginDef` defines node validity. It has a unique identifier called kind that a node uses to specify which plugin it represents. It also has a collection of `configDefs` and `paramDefs`.

A `configDef` defines the name and kind of an expected configuration value on a node. If it is optional, it can define a default value. Kind must be one of the variants defined in valueKind, found in the score level protocol.

A `paramDef` defines the name and kind of an available node param, as well as the param's initial value. Params are inherently optional since their value could be set at a later point via a script adding a command. The kinds of params available here are specified in the `ContractDef`'s `paramKindDefs` field.

A `paramKindDef` defines a name of a param `kind`, e.g., "audio", the kind of value it represents (`valueKind`), and a collection of `commandDefs` that define what commands are available to this param kind.

A `commandDef` defines a name of a command and a collection of `argDefs`. Arguments to a command are *not* ordered.

An `argDef` is a name and value kind of an expected argument to a command. If the argument is optional, it can define a default value.

With this schema we can define what constitutes a valid "gain node" in a graph with a `pluginDef`:

```json
{
  "kind": "com.nativeformat.plugin.waa.gain",
  "paramDefs": [
    {
      "name": "gain",
      "kind": "audio",
      "initialValue": 1
    }
  ]
}
```


A partial definition of an "audio" param kind is:

```json
{
  "kind": "audio",
  "valueKind": "float",
  "commandDefs": [
    {
      "name": "setValueAtTime",
      "argDefs": [
        {
          "name": "value",
          "kind": "float"
        },
        {
          "name": "startTime",
          "kind": "time"
        }
      ]
    },
    {
      "name": "linearRampToValueAtTime",
      "argDefs": [
        {
          "name": "value",
          "kind": "float"
        },
        {
          "name": "endTime",
          "kind": "time"
        }
      ]
    }
  ]
}
```

So with this partial definition, we know that a "gain node" may have a param called "gain", that specifies "audio" commands. We know there are two valid "audio" commands, setValueAtTime and linearRampToValueAtTime. We can understand these command definitions as type signatures, for example:

```
fn setValueAtTime(value: Float, startTime: Time)
fn linearRampToValueAtTime(value: Float, endTime: Time)
```

It's not hard, then, to write a validator using a `ContractDef` and graph. Iterating over each graph, and then on each node, use the definitions in the schema to assert that a node is configured according to the corresponding definition. If, for instance, we have a node in a score level message,

```json
{
  "id": "ee94bfa7-418e-4d13-90a6-fac1e5bd3c37",
  "kind": "com.nativeformat.plugin.waa.gain",
  "params": {
    "notAGainParamButSomethingElse": [
      {
        "name": "foo",
        "args": {
          "bar": "baz"
        }
      }
    ]
  }
}
```

we can assert that it does meet the sample spec defined above. The node defines commands for a param called "notAGainParamButSomethingElse", but the plugin definition for "com.nativeformat.plugins.waa.gain" does not permit such a param.