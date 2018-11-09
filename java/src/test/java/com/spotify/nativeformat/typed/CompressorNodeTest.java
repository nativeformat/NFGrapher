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
import com.spotify.nativeformat.typed.nodes.CompressorNode;
import com.spotify.nativeformat.typed.nodes.FileNode;
import java.util.UUID;
import org.junit.Test;

public class CompressorNodeTest {

  @Test
  public void testSerialization() throws Exception {
    final String json = Converter.getInstance().toJsonString(buildScore());
    assertThat(SchemaValidation.isScoreSchemaCompliant(json), is(true));
    System.out.println(json);
  }

  @Test
  public void testDeserialization() throws Exception {
    final String json = "{\"graph\":{\"id\":\"8d502146-6e78-4b21-b2cc-de5a0a8ed9bc\",\"nodes\":[{\"id\":\"557528b0-92fb-4a14-8541-f4193b9a9624\",\"kind\":\"com.nativeformat.plugin.file.file\",\"loadingPolicy\":\"allContentPlaythrough\",\"config\":{\"duration\":0,\"file\":\"spotify:track:4RDKrwyA9YouzL1LxvMaxH\",\"offset\":0,\"when\":0}},{\"id\":\"3796a523-39fb-4a87-934d-bf7c2c3c0a21\",\"kind\":\"com.nativeformat.plugin.compressor.compressor\",\"loadingPolicy\":\"allContentPlaythrough\",\"params\":{\"thresholdDb\":[],\"kneeDb\":[],\"attack\":[],\"release\":[],\"ratioDb\":[]},\"config\":{\"cutoffs\":[],\"detectionMode\":\"rms\",\"kneeMode\":\"soft\"}}],\"edges\":[{\"id\":\"27086778-3f5f-41bb-9450-e5625677ef61\",\"source\":\"557528b0-92fb-4a14-8541-f4193b9a9624\",\"target\":\"3796a523-39fb-4a87-934d-bf7c2c3c0a21\"}]},\"version\":\"0.7.0\"}";

    final Score score = Converter.getInstance().fromJsonString(json);
    final CompressorNode node = CompressorNode.from(score.graph().nodes().get(1));

    assertThat(node.detectionMode(), is(CompressorNode.DetectionMode.RMS));
    assertThat(node.kneeMode(), is(CompressorNode.KneeMode.SOFT));
  }

  static Score buildScore() {
    // Build a spotify node
    final FileNode.Config fileConfig =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

    final FileNode source = FileNode.create(fileConfig);

    final CompressorNode.Config config = new CompressorNode.Config();
    config
        .detectionMode(CompressorNode.DetectionMode.RMS)
        .kneeMode(CompressorNode.KneeMode.SOFT);

    final CompressorNode compressorNode = CompressorNode.create(config);

    final Graph graph = Graph.builder()
        .id(UUID.randomUUID().toString())
        .addNode(source)
        .addNode(compressorNode)
        .addEdge(source.connect(compressorNode))
        .build();

    return Score.create(graph);
  }

}
