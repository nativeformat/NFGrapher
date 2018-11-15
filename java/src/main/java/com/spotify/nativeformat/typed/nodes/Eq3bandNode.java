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

import com.spotify.nativeformat.schema.ParamMapper;
import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.ContentType;
import com.spotify.nativeformat.score.LoadingPolicy;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.typed.params.AudioParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and
 * cutoff or center frequency of each section are controlled by audio parameters.
 */
public class Eq3bandNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.eq.eq3band";

  private static final ParamMapper<AudioParam> LOW_CUTOFF_PARAM =
      AudioParam.newParamMapper("lowCutoff", 264D);

  private static final ParamMapper<AudioParam> MID_FREQUENCY_PARAM =
      AudioParam.newParamMapper("midFrequency", 1000D);

  private static final ParamMapper<AudioParam> HIGH_CUTOFF_PARAM =
      AudioParam.newParamMapper("highCutoff", 3300D);

  private static final ParamMapper<AudioParam> LOW_GAIN_PARAM =
      AudioParam.newParamMapper("lowGain", 0D);

  private static final ParamMapper<AudioParam> MID_GAIN_PARAM =
      AudioParam.newParamMapper("midGain", 0D);

  private static final ParamMapper<AudioParam> HIGH_GAIN_PARAM =
      AudioParam.newParamMapper("highGain", 0D);

  private AudioParam lowCutoff;

  private AudioParam midFrequency;

  private AudioParam highCutoff;

  private AudioParam lowGain;

  private AudioParam midGain;

  private AudioParam highGain;

  private Eq3bandNode(
      String id,
      LoadingPolicy loadingPolicy,
      AudioParam lowCutoff,
      AudioParam midFrequency,
      AudioParam highCutoff,
      AudioParam lowGain,
      AudioParam midGain,
      AudioParam highGain) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.lowCutoff = lowCutoff;

    this.midFrequency = midFrequency;

    this.highCutoff = highCutoff;

    this.lowGain = lowGain;

    this.midGain = midGain;

    this.highGain = highGain;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @return a new Eq3bandNode
   */
  public static Eq3bandNode create() {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @return a new Eq3bandNode
   */
  public static Eq3bandNode create(LoadingPolicy loadingPolicy) {
    return create(null, loadingPolicy);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @return a new Eq3bandNode
   */
  public static Eq3bandNode create(String id, LoadingPolicy loadingPolicy) {
    return new Eq3bandNode(
        id,
        loadingPolicy,
        LOW_CUTOFF_PARAM.create(),
        MID_FREQUENCY_PARAM.create(),
        HIGH_CUTOFF_PARAM.create(),
        LOW_GAIN_PARAM.create(),
        MID_GAIN_PARAM.create(),
        HIGH_GAIN_PARAM.create());
  }

  /**
   * Creates a new Eq3bandNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new Eq3bandNode
   */
  public static Eq3bandNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new Eq3bandNode(
        node.id(),
        node.loadingPolicy(),
        LOW_CUTOFF_PARAM.readParam(node),
        MID_FREQUENCY_PARAM.readParam(node),
        HIGH_CUTOFF_PARAM.readParam(node),
        LOW_GAIN_PARAM.readParam(node),
        MID_GAIN_PARAM.readParam(node),
        HIGH_GAIN_PARAM.readParam(node));
  }

  /**
   * An audio parameter specifying the cutoff frequency (Hz) for the low shelf filter, below which
   * the lowGain will be applied.
   *
   * @return AudioParam
   */
  public AudioParam lowCutoff() {
    return this.lowCutoff;
  }

  /**
   * An audio parameter specifying the center frequency (Hz) of the peq filter, at which midGain
   * will be applied.
   *
   * @return AudioParam
   */
  public AudioParam midFrequency() {
    return this.midFrequency;
  }

  /**
   * An audio parameter specifying the cutoff frequency for the high shelf filter, above which the
   * highGain will be applied.
   *
   * @return AudioParam
   */
  public AudioParam highCutoff() {
    return this.highCutoff;
  }

  /**
   * An audio parameter specifying the gain (dB) for the low shelf.
   *
   * @return AudioParam
   */
  public AudioParam lowGain() {
    return this.lowGain;
  }

  /**
   * An audio parameter specifying the gain (dB) for the mid range filter.
   *
   * @return AudioParam
   */
  public AudioParam midGain() {
    return this.midGain;
  }

  /**
   * An audio parameter specifying the gain (dB) for the high shelf.
   *
   * @return AudioParam
   */
  public AudioParam highGain() {
    return this.highGain;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    LOW_CUTOFF_PARAM.addToMap(lowCutoff, paramsResult);
    MID_FREQUENCY_PARAM.addToMap(midFrequency, paramsResult);
    HIGH_CUTOFF_PARAM.addToMap(highCutoff, paramsResult);
    LOW_GAIN_PARAM.addToMap(lowGain, paramsResult);
    MID_GAIN_PARAM.addToMap(midGain, paramsResult);
    HIGH_GAIN_PARAM.addToMap(highGain, paramsResult);
    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();

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
}
