# nf-grapher-java

This is a Java library for building Native Format Scores.

> **Note**: This library does _not_ include the Smart Player.

## Getting Started

Include the following dependency in your pom.xml file, with `LATEST-VERSION` set to the [latest released verison](https://github.com/spotify/NFGrapher/releases), for example, `0.1.1`.

```xml
<dependency>
  <groupId>com.spotify.nativeformat</groupId>
  <artifactId>nf-grapher-java</artifactId>
  <version>LATEST-VERSION</version>
</dependency>
```

## Example Usage

```java
// Build a spotify node
final FileNode.Config fileConfig =
    new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

final FileNode source = FileNode.create(fileConfig);

// Create a loop node
// Start a 5.6 second loop from the beginning of the track
final LoopNode.Config loopConfig = new LoopNode.Config()
    .when(Time.ZERO)
    .duration(Time.fromSeconds(5.6));
final LoopNode loop = LoopNode.create(loopConfig);

final Graph graph = Graph.builder()
    .id(UUID.randomUUID().toString())
    .addNode(source)
    .addNode(loop)
    .addEdge(source.connect(loop))
    .build();
```

See the the [generated documentation](../doc/smartplayer.md) from the [Smart Player Contract][contract] for a full list of all Plugins, Params, and Config values.

## Building

This project relies on generated code from [nf-gen-ts][]. If you're updating the Smart Player [contract][], you should run the `generate:java` script from the nf-gen-ts directory.

If you're updating the Score protocol, you'll need to make manual changes to the
interfaces in the [score][] package.

This project is built with maven. Run

```bash
mvn clean package
```

to build, test, and package the library.

## Releasing

TODO

[nf-gen-ts]: ../tools/nf-gen-ts
[contract]: ../smart-player-contract.json
[score]: src/main/java/com/spotify/nativeformat/score
