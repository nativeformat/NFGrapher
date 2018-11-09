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

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import com.spotify.nativeformat.score.Edge;
import com.spotify.nativeformat.typed.nodes.FileNode;
import com.spotify.nativeformat.typed.nodes.GainNode;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class ConnectTest {

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void testProducerToProducerConnectionFails() throws Exception {
    expectedException.expect(IllegalArgumentException.class);

    final FileNode.Config fileConfig =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

    final FileNode source = FileNode.create(fileConfig);

    source.connectToTarget(source);
  }

  @Test
  public void testTransformerToProducerConnectionFails() throws Exception {
    expectedException.expect(IllegalArgumentException.class);

    final FileNode.Config fileConfig =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

    final FileNode source = FileNode.create(fileConfig);
    final GainNode gainNode = GainNode.create();

    gainNode.connectToTarget(source);
  }

  @Test
  public void testProducerToTransformerConnectionSucceeds() throws Exception {
    final FileNode.Config fileConfig =
        new FileNode.Config().file("spotify:track:4RDKrwyA9YouzL1LxvMaxH");

    final FileNode source = FileNode.create(fileConfig);
    final GainNode gainNode = GainNode.create();

    Edge e = source.connectToTarget(gainNode);
    assertThat(e.source(), is(equalTo(source.id())));
    assertThat(e.target(), is(equalTo(gainNode.id())));

    e = gainNode.connectToSource(source);
    assertThat(e.source(), is(equalTo(source.id())));
    assertThat(e.target(), is(equalTo(gainNode.id())));
  }

}