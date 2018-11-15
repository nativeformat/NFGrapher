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

/** A plugin that controls delay time. */
public class DelayNode extends TypedNode {

  /** Unique identifier for the plugin kind this node represents. */
  public static final String PLUGIN_KIND = "com.nativeformat.plugin.waa.delay";

  private static final ParamMapper<AudioParam> DELAY_TIME_PARAM =
      AudioParam.newParamMapper("delayTime", 0D);

  private AudioParam delayTime;

  private DelayNode(String id, LoadingPolicy loadingPolicy, AudioParam delayTime) {
    super(id, PLUGIN_KIND, loadingPolicy);

    this.delayTime = delayTime;
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @return a new DelayNode
   */
  public static DelayNode create() {
    return create(null, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH);
  }

  /**
   * Factory method. Generates a random id for the created instance.
   *
   * @param loadingPolicy the desired node loading policy
   * @return a new DelayNode
   */
  public static DelayNode create(LoadingPolicy loadingPolicy) {
    return create(null, loadingPolicy);
  }

  /**
   * Factory method.
   *
   * @param id the desired node id
   * @param loadingPolicy the desired node loading policy
   * @return a new DelayNode
   */
  public static DelayNode create(String id, LoadingPolicy loadingPolicy) {
    return new DelayNode(id, loadingPolicy, DELAY_TIME_PARAM.create());
  }

  /**
   * Creates a new DelayNode from the given Score Node.
   *
   * @param node the Score Node to convert from
   * @return a new DelayNode
   */
  public static DelayNode from(Node node) {
    if (!PLUGIN_KIND.equals(node.kind())) {
      throw new RuntimeException("expected plugin kind=" + PLUGIN_KIND);
    }

    return new DelayNode(node.id(), node.loadingPolicy(), DELAY_TIME_PARAM.readParam(node));
  }

  /**
   * An audio parameter controlling the current delay time on the node.
   *
   * @return AudioParam
   */
  public AudioParam delayTime() {
    return this.delayTime;
  }

  @Override
  public Map<String, List<Command>> params() {
    final Map<String, List<Command>> paramsResult = new HashMap<>();
    DELAY_TIME_PARAM.addToMap(delayTime, paramsResult);
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
