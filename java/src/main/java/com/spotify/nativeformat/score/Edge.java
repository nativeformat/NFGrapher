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

package com.spotify.nativeformat.score;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.norberg.automatter.AutoMatter;
import javax.annotation.Nullable;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoMatter
public interface Edge {

  @JsonProperty
  String id();

  @JsonProperty
  String source();

  @JsonProperty
  String target();

  @Nullable
  @JsonProperty
  String sourcePort();

  @Nullable
  @JsonProperty
  String targetPort();

  static Edge create(final String id, final String source, final String target) {
    return builder().id(id).source(source).target(target).build();
  }

  static Edge create(final String id, final String source, final String target, 
                     final String sourcePort, final String targetPort) {
    return builder()
        .id(id)
        .source(source)
        .target(target)
        .sourcePort(sourcePort)
        .targetPort(targetPort)
        .build();
  }

  static EdgeBuilder builder() {
    return new EdgeBuilder();
  }
}
