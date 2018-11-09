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

package com.spotify.nativeformat;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.runners.Parameterized.Parameter;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.google.common.base.Charsets;
import com.google.common.io.Files;
import com.spotify.nativeformat.score.Converter;
import com.spotify.nativeformat.score.Score;
import java.io.File;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class ScoresFixtureTest {

  @Parameters(name = "fixture={0}")
  public static Collection<Object[]> data() throws URISyntaxException {
    final File fixturesDir = new File(ScoresFixtureTest.class.getResource("/fixtures").toURI());
    final File[] fixtures = fixturesDir.listFiles();

    if (fixtures == null) {
      return Collections.emptyList();
    }

    return Arrays.stream(fixtures)
        .map(f -> new Object[]{f.getName(), f})
        .collect(Collectors.toList());
  }

  @Parameter(0)
  public String name;

  @Parameter(1)
  public File resource;

  @Rule
  public ExpectedException expectedException = ExpectedException.none();

  @Test
  public void testFixture() throws Exception {
    if (this.resource.getName().startsWith("invalid")) {
      expectedException.expect(JsonMappingException.class);
    }

    final String json = Files.toString(this.resource, Charsets.UTF_8);
    final Converter converter = Converter.getInstance();
    final Score score = converter.fromJsonString(json);

    final String output = converter.toJsonString(score);
    assertThat(SchemaValidation.isScoreSchemaCompliant(output), is(true));
  }

}
