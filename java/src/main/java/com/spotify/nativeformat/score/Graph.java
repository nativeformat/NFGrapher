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
import java.util.List;
import javax.annotation.Nullable;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoMatter
public interface Graph {

  @JsonProperty
  String id();

  @Nullable
  @JsonProperty
  LoadingPolicy loadingPolicy();

  @JsonProperty
  List<Node> nodes();

  @JsonProperty
  List<Edge> edges();

  @JsonProperty
  List<Script> scripts();

  static Graph create(
      final String id,
      final LoadingPolicy loadingPolicy,
      final List<Node> nodes,
      final List<Edge> edges,
      final List<Script> scripts) {
    return builder()
        .id(id)
        .loadingPolicy(loadingPolicy)
        .nodes(nodes)
        .edges(edges)
        .scripts(scripts)
        .build();
  }

  static GraphBuilder builder() {
    return new GraphBuilder();
  }
}
