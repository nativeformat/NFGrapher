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

import com.spotify.nativeformat.score.Converter;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.typed.nodes.FileNode;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class InvalidFileNodeTest {

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void testInvalidFileNodeMissingFileProp() throws Exception {
    expectedException.expect(RuntimeException.class);
    expectedException.expectMessage("arg=file is not set");
    final String json = "{\n"
                        + "          \"id\": \"270b1214-daff-40d8-aa36-a9d6a2cc784f\",\n"
                        + "          \"kind\": \"com.nativeformat.plugin.file.file\",\n"
                        + "          \"config\": {\n"
                        + "            \"duration\": 0,\n"
                        //             NO FILE PROP!
                        + "            \"offset\": 0,\n"
                        + "            \"when\": 0\n"
                        + "          }\n"
                        + "        }";

    final Node node = Converter.getInstance().getObjectMapper().readValue(json, Node.class);
    FileNode.from(node);
  }

  @Test
  public void testInvalidFileNode() throws Exception {
    expectedException.expect(RuntimeException.class);
    expectedException.expectMessage("arg=file expects kind=string");
    final String json = "{\n"
                        + "          \"id\": \"270b1214-daff-40d8-aa36-a9d6a2cc784f\",\n"
                        + "          \"kind\": \"com.nativeformat.plugin.file.file\",\n"
                        + "          \"config\": {\n"
                        + "            \"duration\": 0,\n"
                        //             FILE IS HERE BUT NOT A STRING
                        + "            \"file\": 0,\n"
                        + "            \"offset\": 0,\n"
                        + "            \"when\": 0\n"
                        + "          }\n"
                        + "        }";

    final Node node = Converter.getInstance().getObjectMapper().readValue(json, Node.class);
    FileNode.from(node);
  }
}
