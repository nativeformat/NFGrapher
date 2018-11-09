/*-
 * -\-\-
 * nf-grapher-java
 * --
 * Copyright (C) 2016 - 2018 Spotify AB
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * -/-/-
 */

package com.spotify.nativeformat.typed;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import com.spotify.nativeformat.SchemaValidation;
import com.spotify.nativeformat.score.Converter;
import com.spotify.nativeformat.score.Graph;
import com.spotify.nativeformat.score.Score;
import com.spotify.nativeformat.score.Time;
import com.spotify.nativeformat.typed.nodes.FileNode;
import com.spotify.nativeformat.typed.nodes.GainNode;
import com.spotify.nativeformat.typed.nodes.LoopNode;
import java.util.UUID;
import org.junit.Test;

/**
 * Play multiple tracks at the same time.
 */
public class MultiTrackExampleTest {

  @Test
  public void test() throws Exception {
    final String json = Converter.getInstance().toJsonString(buildScore());
    assertThat(SchemaValidation.isScoreSchemaCompliant(json), is(true));
    System.out.println(json);
  }

  static Score buildScore() {
    // Build a spotify node with drums.
    // This is the same as the DrumLoopExample.
    final FileNode.Config fileConfig =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

    final FileNode drum = FileNode.create(fileConfig);

    // Create a loop node
    // Start a 5.6 second loop from the beginning of the track
    final LoopNode.Config loopConfig = new LoopNode.Config()
        .when(Time.ZERO)
        .duration(Time.fromSeconds(5.6));
    final LoopNode loop = LoopNode.create(loopConfig);

    // Build a spotify node with nature sounds
    // Start the nature sounds after 10 seconds
    final FileNode.Config natureFileConfig = new FileNode.Config()
        .file("spotify:track:3458IPEk4hUgltmvecrYsJ")
        .when(Time.fromSeconds(10));
    final FileNode nature = FileNode.create(natureFileConfig);

    // Turn the volume of the nature sounds down to 0.4
    final GainNode gain = GainNode.create();
    gain.gain().setValueAtTime(0.4, Time.ZERO);

    final Graph graph = Graph.builder()
        .id(UUID.randomUUID().toString())
        // Start by creating the same drum loop as in DrumLoopExample.
        .addNode(drum)
        .addNode(loop)
        .addEdge(drum.connect(loop))

        // To add another track to play, we simply add the nature and gain nodes to the graph.
        .addNode(nature)
        .addNode(gain)
        // ...and then connect them with an edge
        .addEdge(nature.connect(gain))
        .build();

    return Score.create(graph);
  }

}
