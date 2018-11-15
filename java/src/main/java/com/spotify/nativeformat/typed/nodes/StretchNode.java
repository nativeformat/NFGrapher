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

/** A plugin that can independently stretch time and shift the pitch of an audio stream. */
public class StretchNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.time.stretch";

  private static final ParamMapper<AudioParam> PITCH_RATIO_PARAM =
      AudioParam.newParamMapper("pitchRatio", 1D);

  private static final ParamMapper<AudioParam> STRETCH_PARAM =
      AudioParam.newParamMapper("stretch", 1D);

  private static final ParamMapper<AudioParam> FORMANT_RATIO_PARAM =
      AudioParam.newParamMapper("formantRatio", 1D);

  private AudioParam pitchRatio;

  private AudioParam stretch;

  private AudioParam formantRatio;

  private StretchNode(
      String id,
      LoadingPolicy loadingPolicy,
      AudioParam pitchRatio,
      AudioParam stretch,
      AudioParam formantRatio) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.pitchRatio = pitchRatio;

    this.stretch = stretch;

    this.formantRatio = formantRatio;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @return a new StretchNode
   */
  public static StretchNode create() {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @return a new StretchNode
   */
  public static StretchNode create(LoadingPolicy loadingPolicy) {
    return create(null, loadingPolicy);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @return a new StretchNode
   */
  public static StretchNode create(String id, LoadingPolicy loadingPolicy) {
    return new StretchNode(
        id,
        loadingPolicy,
        PITCH_RATIO_PARAM.create(),
        STRETCH_PARAM.create(),
        FORMANT_RATIO_PARAM.create());
  }

  /**
   * Creates a new StretchNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new StretchNode
   */
  public static StretchNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new StretchNode(
        node.id(),
        node.loadingPolicy(),
        PITCH_RATIO_PARAM.readParam(node),
        STRETCH_PARAM.readParam(node),
        FORMANT_RATIO_PARAM.readParam(node));
  }

  /**
   * An audio parameter specifying the pitch multiplier. For example, a pitchRatio value of 2.0 will
   * double the original audio frequencies.
   *
   * @return AudioParam
   */
  public AudioParam pitchRatio() {
    return this.pitchRatio;
  }

  /**
   * An audio parameter specifying the time stretch multiplier. For example, a stretch value of 2.0
   * will make audio play at half the original speed.
   *
   * @return AudioParam
   */
  public AudioParam stretch() {
    return this.stretch;
  }

  /**
   * An audio parameter specifying the formant envelope multiplier. If the formantRatio is equal to
   * the pitchRatio, formant-preserving pitch shifting will be performed.
   *
   * @return AudioParam
   */
  public AudioParam formantRatio() {
    return this.formantRatio;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    PITCH_RATIO_PARAM.addToMap(pitchRatio, paramsResult);
    STRETCH_PARAM.addToMap(stretch, paramsResult);
    FORMANT_RATIO_PARAM.addToMap(formantRatio, paramsResult);
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
