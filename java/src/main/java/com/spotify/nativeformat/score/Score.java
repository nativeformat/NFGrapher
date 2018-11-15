/* Generated */

package com.spotify.nativeformat.score;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.norberg.automatter.AutoMatter;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
@AutoMatter
public interface Score {

  @JsonProperty
  Graph graph();

  @JsonProperty
  String version();

  static Score create(final Graph graph) {
    return create(graph, "1.2.19");
  }

  static Score create(final Graph graph, final String version) {
    return builder().graph(graph).version(version).build();
  }

  static ScoreBuilder builder() {
    return new ScoreBuilder().version("1.2.19");
  }
}
