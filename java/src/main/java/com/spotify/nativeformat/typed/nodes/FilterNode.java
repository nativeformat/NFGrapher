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

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.spotify.nativeformat.schema.ArgMapper;
import com.spotify.nativeformat.schema.ParamMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.ContentType;
import com.spotify.nativeformat.score.LoadingPolicy;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.typed.params.AudioParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** A filter that attenuates low and/or high frequencies */
public class FilterNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.eq.filter";

  private static final ParamMapper<AudioParam> LOW_CUTOFF_PARAM =
      AudioParam.newParamMapper("lowCutoff", 0D);

  private static final ParamMapper<AudioParam> HIGH_CUTOFF_PARAM =
      AudioParam.newParamMapper("highCutoff", 22050D);

  private static final ArgMapper<FilterType> FILTER_TYPE_CONFIG =
      ArgMapper.newEnumArg("filterType", FilterType.fromValue("bandPass"), FilterType.class);

  private AudioParam lowCutoff;

  private AudioParam highCutoff;

  private FilterType filterType;

  private FilterNode(
      String id,
      LoadingPolicy loadingPolicy,
      AudioParam lowCutoff,
      AudioParam highCutoff,
      FilterType filterType) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.lowCutoff = lowCutoff;

    this.highCutoff = highCutoff;

    this.filterType = filterType;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new FilterNode
   */
  public static FilterNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new FilterNode
   */
  public static FilterNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new FilterNode
   */
  public static FilterNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new FilterNode(
        id,
        loadingPolicy,
        LOW_CUTOFF_PARAM.create(),
        HIGH_CUTOFF_PARAM.create(),
        FILTER_TYPE_CONFIG.getValueOrThrow(config.filterType));
  }

  /**
   * Creates a new FilterNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new FilterNode
   */
  public static FilterNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new FilterNode(
        node.id(),
        node.loadingPolicy(),
        LOW_CUTOFF_PARAM.readParam(node),
        HIGH_CUTOFF_PARAM.readParam(node),
        FILTER_TYPE_CONFIG.readConfig(node));
  }

  /**
   * An audio parameter specifying the low cutoff frequency (Hz). Only used for high-pass and
   * band-pass filters.
   *
   * @return AudioParam
   */
  public AudioParam lowCutoff() {
    return this.lowCutoff;
  }

  /**
   * An audio parameter specifying the high cutoff frequency (Hz). Only used for low-pass and
   * band-pass filters.
   *
   * @return AudioParam
   */
  public AudioParam highCutoff() {
    return this.highCutoff;
  }

  /**
   * The type of filter to create. A lowPass filter attenuates frequencies above highCutoff. A
   * highPass filter attenuates frequencies below lowCutoff. A bandPass filter does both.
   *
   * @return FilterType
   */
  public FilterType filterType() {
    return this.filterType;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    LOW_CUTOFF_PARAM.addToMap(lowCutoff, paramsResult);
    HIGH_CUTOFF_PARAM.addToMap(highCutoff, paramsResult);
    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    FILTER_TYPE_CONFIG.addToMap(filterType, configResult);
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

  public enum FilterType {
    LOW_PASS("lowPass"),
    HIGH_PASS("highPass"),
    BAND_PASS("bandPass");

    private static Map<String, FilterType> lookup = new HashMap<>();

    static {
      for (FilterType mode : FilterType.values()) {
        lookup.put(mode.value, mode);
      }
    }

    private String value;

    FilterType(String value) {
      this.value = value;
    }

    @JsonValue
    public String toValue() {
      return this.value;
    }

    @JsonCreator
    public static FilterType fromValue(final String value) {
      final FilterType e = lookup.get(value);
      if (e == null) {
        throw new IllegalArgumentException("Cannot build FilterType for value=" + value);
      }
      return e;
    }
  }
  /**
   * A configuration class for a FilterNode.
   *
   * @see FilterNode#create(Config)
   * @see FilterNode#create(LoadingPolicy, Config)
   * @see FilterNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private FilterType filterType;

    /** @return the current value of <code>filterType</code> */
    public FilterType filterType() {
      return this.filterType;
    }

    /**
     * Sets the value of <code>filterType</code>.
     *
     * @see FilterNode#filterType()
     * @return this Config instance
     */
    public Config filterType(final FilterType filterType) {
      this.filterType = filterType;
      return this;
    }
  }
}
