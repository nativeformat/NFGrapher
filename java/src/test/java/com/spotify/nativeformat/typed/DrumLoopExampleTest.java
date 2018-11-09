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
import com.spotify.nativeformat.typed.nodes.LoopNode;
import java.util.UUID;
import org.junit.Test;

/**
 * Create an infinite drum loop from a track with a loop node.
 */
public class DrumLoopExampleTest {

  @Test
  public void test() throws Exception {
    final String json = Converter.getInstance().toJsonString(buildScore());
    assertThat(SchemaValidation.isScoreSchemaCompliant(json), is(true));
    System.out.println(json);
  }

  static Score buildScore() {
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

    return Score.create(graph);
  }

}
