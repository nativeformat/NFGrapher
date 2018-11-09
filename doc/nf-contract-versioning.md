This document spells out in excessive detail how changes to the contract should be handled and versioned.

Compatibility
-------------

Our Smart Player contract defines the expectations of the Smart Player at a particular version. Those expectations are then converted with nf-gen-ts into client libraries that help clients build semantically meaningful and valid Scores for playback. However, expectations can change over time, and we should strive to keep existing client applications valid, and upgrading applications easy.

We're focused on two aspects of compatibility: format and code. From [wikipedia](https://en.wikipedia.org/wiki/Backward_compatibility#Software):

> "A data format is said to be backwards compatible with its predecessor if every message or file that is valid under the old format is still valid, retaining its meaning under the new format."

And let's expand the definition a bit for code:

> A library is said to be backwards compatible with its predecessor if every bit of code that is valid under the old library is still valid, retaining its meaning under the new library.

Thus, as much as possible, we want:

- Old versions of the format to "work" with newer versions of the Smart Player and generated grapher libraries, and
- Old code using a generated grapher library to "work" with new versions of said libraries.

Furthermore, we also care about forwards compatibility, that newer versions of the format "work" with older versions of the Smart Player and generated grapher libraries. As an example, the nf-grapher-java library at version *v* should successfully parse an incoming score at version *v+1*. This should also be true of the Smart Player, though, we cannot make any strong guarantees about rendering. An incoming score at version *v+1* may reference plugins a Smart Player at version *v* does not know about.

TODO: we need a deprecation concept in the contract to make any of the deprecation changes possible. Deprecation should also include a removal version

Note: this document describes desired behavior of how changes affect compatibility, not the current state of the project.

Version Numbering
-----------------

- Use [semver](https://semver.org/)
    - Version metadata may contain [extra information](https://semver.org/#spec-item-10) about build, commit hash, etc. This is not finalized.
    - Patch numbers are defined automatically by our release scripts. A patch increments by one every release, unless there is a major or minor version change in the contract.
    - Minor version is explicitly set on the contract
    - Major version is explicitly set on the contract

- Versioning is consistent across all generated libraries
    - One result of this though is that two different versions of a library may not contain material changes. For example, if typescript code generation is broken, and requires a new release, that would also result in a corresponding release of the java library.

Contract Changes
----------------

Contract changes are any change to the contract JSON file.

To update the contract version number, update the version string in the [contract file](../smart-player-contract.json).

Plugins
-------

### Adding a PluginDef

- Minor change
- Backwards compatible

How

1.  Add the new pluginDef to the contract
2.  Bump the minor version

### Deprecating a PluginDef

- Minor change
- Backwards compatible

This does not mean *removing* a plugin or the plugin code from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the pluginDef as deprecated in the contract
2.  Bump the minor version

### Removing a PluginDef

Major change

Backwards incompatible

How

1.  Remove the pluginDef in the contract
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a PluginDef

- Minor change
- Backwards compatible

How

1.  Deprecate the existing pluginDef
2.  Add a new pluginDef with the new name
3.  Bump the minor version
4.  Generate code

Params
------

### Adding a param

- Minor change
- Backwards compatible

How

1.  Add the new param to the pluginDef
2.  Bump the minor version

### Deprecating a param

- Minor change
- Backwards compatible

This does not mean *removing* a param or support for the param from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the param as deprecated in the contract
2.  Bump the minor version

### Removing a param

Major change

Backwards incompatible

How

1.  Remove the param from the pluginDef
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a param

- Minor change
- Backwards compatible

How

1.  Deprecate the existing param
2.  Add a new param
3.  Bump the minor version

### Changing param kind

- Minor change
- Backwards compatible

How

1.  Deprecate the existing param
2.  Add a new param with a new name and the desired kind
3.  Bump the minor version

### Changing param initial value

- Minor change
- Backwards compatible

TODO: kinda compatible. The initial value of a param isn't included in the score in any way. So if a score is created understanding the initial value to be a certain value, and that initial value changes in future versions, playback maybe incorrect. For example: suppose the initial value of the gain param in the gain plugin at version *v* is 1.0. I then make a score around that assumption that ramps the gain down to 0. In the next version *v+1* we change the initial value to 0.0. Then playback ("meaning") is not preserved. This is different than config default values. If a config is not set by a client using our libraries, our libraries will "fill it in" on serialization with whatever the default value is at that version. If future versions change the default value, it has no effect on scores serialized at older versions.

How

1.  Update the initial value
2.  Bump the minor version

Config
------

### Adding a config

- Minor change
- Backwards compatible

How

1.  Add the new config to the pluginDef
2.  Bump the minor version

### Deprecating a config

- Minor change
- Backwards compatible

This does not mean *removing* a config or support for the config from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the config as deprecated in the contract
2.  Bump the minor version

### Removing a config

Major change

Backwards incompatible

How

1.  Remove the config from the pluginDef
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a config

- Minor change
- Backwards compatible

How

1.  Deprecate the existing config
2.  Add a new config
3.  Bump the minor version

### Changing config type

- Minor change
- Backwards compatible

How

1.  Deprecate the existing config

2.  Add a new config with a new name and the desired kind

3.  Bump the minor version

### Adding a default value

- Minor change
- Backwards compatible

How

1.  Add a default value

2.  Bump the minor version

### Changing the default value

- Minor change
- Backwards compatible

If a config value is not set by a client using our libraries, our libraries will "fill it in" on serialization with whatever the default value is at that version. If future versions change the default value, it has no effect on scores serialized at older versions.

How

1.  Change the default value
2.  Bump the minor version

### Removing a default value

Major change

Backwards incompatible

How

1.  Remove the default value
2.  Bump the major version
3.  Reset the minor version to 0

Values
------

### Adding a value kind

- Minor change
- Backwards compatible

Adding a new type is a compatible change, but you cannot change what an existing type means or how it is serialized.

How

1.  Add new type to ValueKind in score-schema.json.
2.  (Optional) And relevant serializer/deserializers to generated code.
3.  Bump the minor version

### Removing a value kind

Major change

Backwards incompatible

This can only be performed if there are no longer any references to the value kind in the contract. Note that contract validation will prevent the removal of any value kind with lingering references.

How

1.  Remove the kind from ValueKind
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a value kind

Major change

Backwards incompatible

Value kind names are somewhat internal to the contract itself. It's **not** recommend to do this kind of change as it's confusing, and there is handwritten code in the generators and libraries that uses these names.

How

1.  Add a new kind with the desired name
2.  Remove the old value kind
3.  Bump the major version
4.  Reset the minor version to 0

ParamKind
---------

### Adding a paramKind

- Minor change
- Backwards compatible

How

1.  Add the new paramKind to the contract
2.  Bump the minor version

### Deprecating a paramKind

- Minor change
- Backwards compatible

This does not mean *removing* a param kind or support for the param kind from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the paramKind as deprecated in the contract
2.  Bump the minor version

### Removing a paramKind

Major change

Backwards incompatible

This can only be performed if there are no longer any references to the paramKind in the contract. Note that contract validation will prevent the removal of any paramKind with lingering references.

Note: I suppose if there are no references to the kind in the contract, it doesn't necessarily require a major bump. However, code generation will still generate public classes for these definitions that could be used by clients. For consistency, it's helpful to treat all removals as major bumps.

How

1.  Remove the paramKind
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a paramKind

- Minor change
- Backwards compatible

How

1.  Deprecate the existing paramKind
2.  Add a new paramKind
3.  Follow instructions for changing param kind for every param that references this kind
4.  Bump the minor version

### Changing valueKind

- Minor change
- Backwards compatible

How

1.  Deprecate the existing paramKind
2.  Add a new paramKind with a new name and the desired valueKind
3.  Follow instructions for changing param kind for every param that references this kind
4.  Bump the minor version

Commands
--------

### Adding a command

- Minor change
- Backwards compatible

How

1.  Add the new command to the contract
2.  Bump the minor version

### Deprecating a command

- Minor change
- Backwards compatible

This does not mean *removing* a command or support for the command from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the command as deprecated in the contract
2.  Bump the minor version

### Removing a command

Major change

Backwards incompatible

How

1.  Remove the command in the contract
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a command

- Minor change
- Backwards compatible

How

1.  Deprecate the existing command
2.  Add a new command
3.  Bump the minor version

### Adding a command argument

- Minor change
- Backwards compatible

Note: This *should* be backwards compatible, so long as it is added with a default value. However, that is not true today. In Java, for instance, commands are generated as methods on a Param class. If we were to add an arg, the code would not be backwards compatible, since the method signature is changing, and Java does not support arguments with default values.

How

1.  Add a new arg to the command
2.  **Must specify a default value**
3.  Bump the minor version

### Deprecating a command argument

- Minor change
- Backwards compatible

This does not mean *removing* the command argument or support for if from the player. It simply indicates the intent to remove it at a future date. This should not change functionality or playback. Generated code should use language specific constructs to flag the code as deprecated.

How

1.  Mark the command as deprecated in the contract
2.  Bump the minor version

### Removing a command argument

Major change

Backwards incompatible

How

1.  Remove the argument from the command
2.  Bump the major version
3.  Reset the minor version to 0

### Renaming a command argument

- Minor change
- Backwards compatible

Note: Doing this will require providing a default value for argument.

How

1.  Deprecate the existing argument
2.  Add a new argument with the desired name
3.  Bump the minor version

### Adding an argument default value

- Minor change
- Backwards compatible

How

1.  Add a default value to the argument
2.  Bump the minor version

### Changing an argument default value

- Minor change
- Backwards compatible

If an argument is not set by a client using our libraries, our libraries will "fill it in" on serialization with whatever the default value is at that version. If future versions change the default value, it has no effect on scores serialized at older versions.

How

1.  Change the default value
2.  Bump the minor version

### Removing an argument default value

Major change

Backwards incompatible

How

1.  Remove the default value
2.  Bump the major version
3.  Reset the minor version to 0

### Changing an argument valueKind

- Minor change
- Backwards compatible

How

1.  Deprecate the existing argument
2.  Add a new argument with a new name and the desired kind
3.  Bump the minor version

Code Generation Changes
-----------------------

Changes in code generation can also affect compatibility with our generated libraries.

### Backwards compatible API change

Should affect the patch version which is handled automatically by our deployment scripts. There is no need to modify the contract's major or minor version.

Examples:

- Introducing new methods, classes, functions
- Deprecating methods, classes functions
- Fixing logic or implementation bugs that do not change how the API is used

### Backwards incompatible API change

Should affect the major version. This must be done by modifying the contract's major version number.

Examples:

- Removing methods, classes, functions, arguments
- Fixing bugs that require significant changes to user code
