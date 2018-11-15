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

/** A plugin that generates sine wave signals. */
public class SineNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.wave.sine";

  private static final ArgMapper<Double> FREQUENCY_CONFIG = ArgMapper.newFloatArg("frequency", 0D);

  private static final ArgMapper<Time> WHEN_CONFIG =
      ArgMapper.newTimeArg("when", Time.fromNanos(0));

  private static final ArgMapper<Time> DURATION_CONFIG =
      ArgMapper.newTimeArg("duration", Time.fromNanos(0));

  private Double frequency;

  private Time when;

  private Time duration;

  private SineNode(
      String id, LoadingPolicy loadingPolicy, Double frequency, Time when, Time duration) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.frequency = frequency;

    this.when = when;

    this.duration = duration;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new SineNode
   */
  public static SineNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new SineNode
   */
  public static SineNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new SineNode
   */
  public static SineNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new SineNode(
        id,
        loadingPolicy,
        FREQUENCY_CONFIG.getValueOrThrow(config.frequency),
        WHEN_CONFIG.getValueOrThrow(config.when),
        DURATION_CONFIG.getValueOrThrow(config.duration));
  }

  /**
   * Creates a new SineNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new SineNode
   */
  public static SineNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new SineNode(
        node.id(),
        node.loadingPolicy(),
        FREQUENCY_CONFIG.readConfig(node),
        WHEN_CONFIG.readConfig(node),
        DURATION_CONFIG.readConfig(node));
  }

  /**
   * The frequency to generate the sine wave at.
   *
   * @return Double
   */
  public Double frequency() {
    return this.frequency;
  }

  /**
   * When to start playing the wave.
   *
   * @return Time
   */
  public Time when() {
    return this.when;
  }

  /**
   * The total duration of playback.
   *
   * @return Time
   */
  public Time duration() {
    return this.duration;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();

    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    FREQUENCY_CONFIG.addToMap(frequency, configResult);
    WHEN_CONFIG.addToMap(when, configResult);
    DURATION_CONFIG.addToMap(duration, configResult);
    return configResult;
  }

  @Override
  public Map<String, ContentType> inputs() {
    final Map<String, ContentType> inputsResult = new HashMap<>();

    return inputsResult;
  }

  @Override
  public Map<String, ContentType> outputs() {
    final Map<String, ContentType> outputsResult = new HashMap<>();
    outputsResult.put("audio", ContentType.AUDIO);
    return outputsResult;
  }

  /**
   * A configuration class for a SineNode.
   *
   * @see SineNode#create(Config)
   * @see SineNode#create(LoadingPolicy, Config)
   * @see SineNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private Double frequency;

    private Time when;

    private Time duration;

    /** @return the current value of <code>frequency</code> */
    public Double frequency() {
      return this.frequency;
    }

    /**
     * Sets the value of <code>frequency</code>.
     *
     * @see SineNode#frequency()
     * @return this Config instance
     */
    public Config frequency(final Double frequency) {
      this.frequency = frequency;
      return this;
    }

    /** @return the current value of <code>when</code> */
    public Time when() {
      return this.when;
    }

    /**
     * Sets the value of <code>when</code>.
     *
     * @see SineNode#when()
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
     * @see SineNode#duration()
     * @return this Config instance
     */
    public Config duration(final Time duration) {
      this.duration = duration;
      return this;
    }
  }
}
