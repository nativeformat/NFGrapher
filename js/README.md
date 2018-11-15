# nf-grapher

This is a JavaScript library for building Native Format Scores.

> **Note**: This library does _not_ include the Smart Player.

## Getting Started

```
npm install nf-grapher
```

This library is written in [TypeScript](http://www.typescriptlang.org/) and definitions are included.

## Example Usage

```typescript
import {
  Score,
  Graph,
  FileNode,
  LoopNode,
  GainNode,
  secondsToNanos
} from '@spotify/nf-grapher';

// Create a Spotify node.
const file = FileNode.create({
  file: 'spotify:track:275KAjHjZOtnTVWZ2Kcr7k'
});

// Create a 5.6 second loop, starting at the beginning of the track.
const loop = LoopNode.create({
  when: 0,
  duration: secondsToNanos(5.6)
});

// Create a gain node that fades in over 3 seconds.
const gain = GainNode.create();
gain.gain.setValueAtTime(0, 0);
gain.gain.linearRampToValueAtTime(1, secondsToNanos(3));

const graph = new Graph();
graph.nodes.push(file, loop, gain);
graph.edges.push(file.connect(loop), loop.connect(gain));

const score = new Score(graph);

console.log(JSON.stringify(score, null, 2));
```
