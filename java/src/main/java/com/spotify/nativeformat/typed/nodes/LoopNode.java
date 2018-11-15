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

/* Generated */

package com.spotify.nativeformat.typed.nodes;

import com.spotify.nativeformat.schema.ArgMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.ContentType;
import com.spotify.nativeformat.score.LoadingPolicy;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.score.Time;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/** A plugin that loops an audio stream. */
public class LoopNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.time.loop";

  private static final ArgMapper<Time> WHEN_CONFIG = ArgMapper.newTimeArg("when", null);

  private static final ArgMapper<Time> DURATION_CONFIG = ArgMapper.newTimeArg("duration", null);

  private static final ArgMapper<Long> LOOP_COUNT_CONFIG = ArgMapper.newIntArg("loopCount", -1L);

  private Time when;

  private Time duration;

  private Long loopCount;

  private LoopNode(
      String id, LoadingPolicy loadingPolicy, Time when, Time duration, Long loopCount) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.when = when;

    this.duration = duration;

    this.loopCount = loopCount;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new LoopNode
   */
  public static LoopNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new LoopNode
   */
  public static LoopNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new LoopNode
   */
  public static LoopNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new LoopNode(
        id,
        loadingPolicy,
        Objects.requireNonNull(config.when, "when"),
        Objects.requireNonNull(config.duration, "duration"),
        LOOP_COUNT_CONFIG.getValueOrThrow(config.loopCount));
  }

  /**
   * Creates a new LoopNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new LoopNode
   */
  public static LoopNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new LoopNode(
        node.id(),
        node.loadingPolicy(),
        WHEN_CONFIG.readConfig(node),
        DURATION_CONFIG.readConfig(node),
        LOOP_COUNT_CONFIG.readConfig(node));
  }

  /**
   * Describes when the plugin should begin looping.
   *
   * @return Time
   */
  public Time when() {
    return this.when;
  }

  /**
   * Describes the duration of the loop.
   *
   * @return Time
   */
  public Time duration() {
    return this.duration;
  }

  /**
   * Describes the total number of loops. -1 loops infinitely.
   *
   * @return Long
   */
  public Long loopCount() {
    return this.loopCount;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();

    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    WHEN_CONFIG.addToMap(when, configResult);
    DURATION_CONFIG.addToMap(duration, configResult);
    LOOP_COUNT_CONFIG.addToMap(loopCount, configResult);
    return configResult;
  }

  @Override
  public Map<String, ContentType> inputs() {
    final Map<String, ContentType> inputsResult = new HashMap<>();
    inputsResult.put("audio", ContentType.AUDIO);
    return inputsResult;
  }

  @Override
  public Map<String, ContentType> outputs() {
    final Map<String, ContentType> outputsResult = new HashMap<>();
    outputsResult.put("audio", ContentType.AUDIO);
    return outputsResult;
  }

  /**
   * A configuration class for a LoopNode.
   *
   * @see LoopNode#create(Config)
   * @see LoopNode#create(LoadingPolicy, Config)
   * @see LoopNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private Time when;

    private Time duration;

    private Long loopCount;

    /** @return the current value of <code>when</code> */
    public Time when() {
      return this.when;
    }

    /**
     * Sets the value of <code>when</code>.
     *
     * @see LoopNode#when()
     * @return this Config instance
     */
    public Config when(final Time when) {
      this.when = when;
      return this;
    }

    /** @return the current value of <code>duration</code> */
    public Time duration() {
      return this.duration;
    }

    /**
     * Sets the value of <code>duration</code>.
     *
     * @see LoopNode#duration()
     * @return this Config instance
     */
    public Config duration(final Time duration) {
      this.duration = duration;
      return this;
    }

    /** @return the current value of <code>loopCount</code> */
    public Long loopCount() {
      return this.loopCount;
    }

    /**
     * Sets the value of <code>loopCount</code>.
     *
     * @see LoopNode#loopCount()
     * @return this Config instance
     */
    public Config loopCount(final Long loopCount) {
      this.loopCount = loopCount;
      return this;
    }
  }
}
