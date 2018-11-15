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

/** A plugin that manipulates the volume of an audio stream. */
public class GainNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.waa.gain";

  private static final ParamMapper<AudioParam> GAIN_PARAM = AudioParam.newParamMapper("gain", 1D);

  private AudioParam gain;

  private GainNode(String id, LoadingPolicy loadingPolicy, AudioParam gain) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.gain = gain;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @return a new GainNode
   */
  public static GainNode create() {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @return a new GainNode
   */
  public static GainNode create(LoadingPolicy loadingPolicy) {
    return create(null, loadingPolicy);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @return a new GainNode
   */
  public static GainNode create(String id, LoadingPolicy loadingPolicy) {
    return new GainNode(id, loadingPolicy, GAIN_PARAM.create());
  }

  /**
   * Creates a new GainNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new GainNode
   */
  public static GainNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new GainNode(node.id(), node.loadingPolicy(), GAIN_PARAM.readParam(node));
  }

  /**
   * An audio parameter specifying the amplitude multiplier for the input signal.
   *
   * @return AudioParam
   */
  public AudioParam gain() {
    return this.gain;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    GAIN_PARAM.addToMap(gain, paramsResult);
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
