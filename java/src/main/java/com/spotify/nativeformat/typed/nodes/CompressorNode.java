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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** A plugin that performs dynamic range compression on an audio stream. */
public class CompressorNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.compressor.compressor";

  private static final ParamMapper<AudioParam> THRESHOLD_DB_PARAM =
      AudioParam.newParamMapper("thresholdDb", -24D);

  private static final ParamMapper<AudioParam> KNEE_DB_PARAM =
      AudioParam.newParamMapper("kneeDb", 30D);

  private static final ParamMapper<AudioParam> RATIO_DB_PARAM =
      AudioParam.newParamMapper("ratioDb", 12D);

  private static final ParamMapper<AudioParam> ATTACK_PARAM =
      AudioParam.newParamMapper("attack", 0.0003D);

  private static final ParamMapper<AudioParam> RELEASE_PARAM =
      AudioParam.newParamMapper("release", 0.25D);

  private static final ArgMapper<DetectionMode> DETECTION_MODE_CONFIG =
      ArgMapper.newEnumArg("detectionMode", DetectionMode.fromValue("max"), DetectionMode.class);

  private static final ArgMapper<KneeMode> KNEE_MODE_CONFIG =
      ArgMapper.newEnumArg("kneeMode", KneeMode.fromValue("hard"), KneeMode.class);

  private static final ArgMapper<List<Double>> CUTOFFS_CONFIG =
      ArgMapper.newFloatListArg("cutoffs", Arrays.asList());

  private AudioParam thresholdDb;

  private AudioParam kneeDb;

  private AudioParam ratioDb;

  private AudioParam attack;

  private AudioParam release;

  private DetectionMode detectionMode;

  private KneeMode kneeMode;

  private List<Double> cutoffs;

  private CompressorNode(
      String id,
      LoadingPolicy loadingPolicy,
      AudioParam thresholdDb,
      AudioParam kneeDb,
      AudioParam ratioDb,
      AudioParam attack,
      AudioParam release,
      DetectionMode detectionMode,
      KneeMode kneeMode,
      List<Double> cutoffs) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.thresholdDb = thresholdDb;

    this.kneeDb = kneeDb;

    this.ratioDb = ratioDb;

    this.attack = attack;

    this.release = release;

    this.detectionMode = detectionMode;

    this.kneeMode = kneeMode;

    this.cutoffs = cutoffs;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param config a Config object used to initialze the node
   * @return a new CompressorNode
   */
  public static CompressorNode create(Config config) {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH, config);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialze the node
   * @return a new CompressorNode
   */
  public static CompressorNode create(LoadingPolicy loadingPolicy, Config config) {
    return create(null, loadingPolicy, config);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @param config a Config object used to initialize the node
   * @return a new CompressorNode
   */
  public static CompressorNode create(String id, LoadingPolicy loadingPolicy, Config config) {
    return new CompressorNode(
        id,
        loadingPolicy,
        THRESHOLD_DB_PARAM.create(),
        KNEE_DB_PARAM.create(),
        RATIO_DB_PARAM.create(),
        ATTACK_PARAM.create(),
        RELEASE_PARAM.create(),
        DETECTION_MODE_CONFIG.getValueOrThrow(config.detectionMode),
        KNEE_MODE_CONFIG.getValueOrThrow(config.kneeMode),
        CUTOFFS_CONFIG.getValueOrThrow(config.cutoffs));
  }

  /**
   * Creates a new CompressorNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new CompressorNode
   */
  public static CompressorNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new CompressorNode(
        node.id(),
        node.loadingPolicy(),
        THRESHOLD_DB_PARAM.readParam(node),
        KNEE_DB_PARAM.readParam(node),
        RATIO_DB_PARAM.readParam(node),
        ATTACK_PARAM.readParam(node),
        RELEASE_PARAM.readParam(node),
        DETECTION_MODE_CONFIG.readConfig(node),
        KNEE_MODE_CONFIG.readConfig(node),
        CUTOFFS_CONFIG.readConfig(node));
  }

  /**
   * An audio parameter specifying the threshold (in dB) at which compression will start.
   *
   * @return AudioParam
   */
  public AudioParam thresholdDb() {
    return this.thresholdDb;
  }

  /**
   * An audio parameter specifying the range (in dB) above the threshold at which point the
   * compression curve transitions to the ratio portion.
   *
   * @return AudioParam
   */
  public AudioParam kneeDb() {
    return this.kneeDb;
  }

  /**
   * An audio parameter specifying the amount of dB change from input to 1 dB of output.
   *
   * @return AudioParam
   */
  public AudioParam ratioDb() {
    return this.ratioDb;
  }

  /**
   * An audio parameter specifying the amount time till the compressor starts reducing the gain.
   *
   * @return AudioParam
   */
  public AudioParam attack() {
    return this.attack;
  }

  /**
   * An audio parameter specifying the amount time till the compressor starts increasing the gain.
   *
   * @return AudioParam
   */
  public AudioParam release() {
    return this.release;
  }

  /**
   * The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean
   * square). This configuration is case-sensitive. Any specified configuration not matching 'max'
   * or 'rms' will be automatically set to 'max'.
   *
   * @return DetectionMode
   */
  public DetectionMode detectionMode() {
    return this.detectionMode;
  }

  /**
   * The shape of the knee in the compression function. Possible values are hard and soft. This
   * configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will
   * be automatically set to 'hard'.
   *
   * @return KneeMode
   */
  public KneeMode kneeMode() {
    return this.kneeMode;
  }

  /**
   * A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band
   * splitting will be performed.
   *
   * @return List<Double>
   */
  public List<Double> cutoffs() {
    return this.cutoffs;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    THRESHOLD_DB_PARAM.addToMap(thresholdDb, paramsResult);
    KNEE_DB_PARAM.addToMap(kneeDb, paramsResult);
    RATIO_DB_PARAM.addToMap(ratioDb, paramsResult);
    ATTACK_PARAM.addToMap(attack, paramsResult);
    RELEASE_PARAM.addToMap(release, paramsResult);
    return paramsResult;
  }

  @Override
  public Map<String, Object> config() {
    final Map<String, Object> configResult = new HashMap<>();
    DETECTION_MODE_CONFIG.addToMap(detectionMode, configResult);
    KNEE_MODE_CONFIG.addToMap(kneeMode, configResult);
    CUTOFFS_CONFIG.addToMap(cutoffs, configResult);
    return configResult;
  }

  @Override
  public Map<String, ContentType> inputs() {
    final Map<String, ContentType> inputsResult = new HashMap<>();
    inputsResult.put("audio", ContentType.AUDIO);
    inputsResult.put("sidechain", ContentType.AUDIO);
    return inputsResult;
  }

  @Override
  public Map<String, ContentType> outputs() {
    final Map<String, ContentType> outputsResult = new HashMap<>();
    outputsResult.put("audio", ContentType.AUDIO);
    return outputsResult;
  }

  public enum DetectionMode {
    MAX("max"),
    RMS("rms");

    private static Map<String, DetectionMode> lookup = new HashMap<>();

    static {
      for (DetectionMode mode : DetectionMode.values()) {
        lookup.put(mode.value, mode);
      }
    }

    private String value;

    DetectionMode(String value) {
      this.value = value;
    }

    @JsonValue
    public String toValue() {
      return this.value;
    }

    @JsonCreator
    public static DetectionMode fromValue(final String value) {
      final DetectionMode e = lookup.get(value);
      if (e == null) {
        throw new IllegalArgumentException("Cannot build DetectionMode for value=" + value);
      }
      return e;
    }
  }

  public enum KneeMode {
    HARD("hard"),
    SOFT("soft");

    private static Map<String, KneeMode> lookup = new HashMap<>();

    static {
      for (KneeMode mode : KneeMode.values()) {
        lookup.put(mode.value, mode);
      }
    }

    private String value;

    KneeMode(String value) {
      this.value = value;
    }

    @JsonValue
    public String toValue() {
      return this.value;
    }

    @JsonCreator
    public static KneeMode fromValue(final String value) {
      final KneeMode e = lookup.get(value);
      if (e == null) {
        throw new IllegalArgumentException("Cannot build KneeMode for value=" + value);
      }
      return e;
    }
  }
  /**
   * A configuration class for a CompressorNode.
   *
   * @see CompressorNode#create(Config)
   * @see CompressorNode#create(LoadingPolicy, Config)
   * @see CompressorNode#create(String, LoadingPolicy, Config)
   */
  public static class Config {

    private DetectionMode detectionMode;

    private KneeMode kneeMode;

    private List<Double> cutoffs;

    /** @return the current value of <code>detectionMode</code> */
    public DetectionMode detectionMode() {
      return this.detectionMode;
    }

    /**
     * Sets the value of <code>detectionMode</code>.
     *
     * @see CompressorNode#detectionMode()
     * @return this Config instance
     */
    public Config detectionMode(final DetectionMode detectionMode) {
      this.detectionMode = detectionMode;
      return this;
    }

    /** @return the current value of <code>kneeMode</code> */
    public KneeMode kneeMode() {
      return this.kneeMode;
    }

    /**
     * Sets the value of <code>kneeMode</code>.
     *
     * @see CompressorNode#kneeMode()
     * @return this Config instance
     */
    public Config kneeMode(final KneeMode kneeMode) {
      this.kneeMode = kneeMode;
      return this;
    }

    /** @return the current value of <code>cutoffs</code> */
    public List<Double> cutoffs() {
      return this.cutoffs;
    }

    /**
     * Sets the value of <code>cutoffs</code>.
     *
     * @see CompressorNode#cutoffs()
     * @return this Config instance
     */
    public Config cutoffs(final List<Double> cutoffs) {
      this.cutoffs = cutoffs;
      return this;
    }
  }
}
