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
import java.util.UUID;
import org.junit.Test;

/**
 * Play a track, fading in over 30 seconds
 */
public class FadeInExampleTest {

  @Test
  public void test() throws Exception {
    final String json = Converter.getInstance().toJsonString(buildScore());
    assertThat(SchemaValidation.isScoreSchemaCompliant(json), is(true));
    System.out.println(json);
  }

  static Score buildScore() {
    // Build a spotify node
    final FileNode.Config config =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");
    final FileNode source = FileNode.create(config);

    // Build a 10 second fade in
    final GainNode gain = GainNode.create();

    // Linearly increase the value to 1.0 over 10 seconds
    gain.gain().linearRampToValueAtTime(1.0, Time.fromSeconds(10));

    final Graph graph = Graph.builder()
        .id(UUID.randomUUID().toString())
        .addNode(source)
        .addNode(gain)
        .addEdge(source.connect(gain))
        .build();

    return Score.create(graph);
  }

}
