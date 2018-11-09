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
import java.util.Map;
import javax.annotation.Nullable;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoMatter
public interface Node {

  @JsonProperty
  String id();

  @JsonProperty
  String kind();

  @Nullable
  @JsonProperty
  LoadingPolicy loadingPolicy();

  @JsonProperty
  Map<String, List<Command>> params();

  @JsonProperty
  Map<String, Object> config();

  static Node create(
      final String id,
      final String kind,
      final LoadingPolicy loadingPolicy,
      final Map<String, List<Command>> params,
      final Map<String, Object> config) {
    return builder()
        .id(id)
        .kind(kind)
        .loadingPolicy(loadingPolicy)
        .params(params)
        .config(config)
        .build();
  }

  static NodeBuilder builder() {
    return new NodeBuilder();
  }
}
