// Copyright (c) 2018 Spotify AB.
//
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/* Generated */

import { v4 as uuid } from 'uuid';
import { Command, Node, ContentType } from '../../score';
import ArgMapper from '../../schema/ArgMapper';
import TypedNode from './TypedNode';
import AudioParam from '../params/AudioParam';

/**
 * ExpanderNodeDetectionMode.
 */
export enum ExpanderNodeDetectionMode {
  MAX = 'max',
  RMS = 'rms'
}
/**
 * ExpanderNodeKneeMode.
 */
export enum ExpanderNodeKneeMode {
  HARD = 'hard',
  SOFT = 'soft'
}

/**
 * ExpanderNodeConfig.
 */
export interface ExpanderNodeConfig {
  detectionMode?: ExpanderNodeDetectionMode;
  kneeMode?: ExpanderNodeKneeMode;
  cutoffs?: number[];
}

/**
 * ExpanderNode.
 */
class ExpanderNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.compressor.expander';

  /**
   * Creates a new `string` mapper for the `detectionMode` param.
   */
  private static DETECTION_MODE_CONFIG = ArgMapper.newEnumArg<
    ExpanderNodeDetectionMode
  >(
    'detectionMode',
    ExpanderNodeDetectionMode.MAX,
    Object.values(ExpanderNodeDetectionMode)
  );

  /**
   * Creates a new `string` mapper for the `kneeMode` param.
   */
  private static KNEE_MODE_CONFIG = ArgMapper.newEnumArg<ExpanderNodeKneeMode>(
    'kneeMode',
    ExpanderNodeKneeMode.HARD,
    Object.values(ExpanderNodeKneeMode)
  );

  /**
   * Creates a new `number[]` mapper for the `cutoffs` param.
   */
  private static CUTOFFS_CONFIG = ArgMapper.newFloatListArg('cutoffs', []);

  /**
   * `thresholdDb` param factory.
   */
  private static THRESHOLD_DB_PARAM = AudioParam.newParamMapper(
    'thresholdDb',
    -24
  );

  /**
   * `kneeDb` param factory.
   */
  private static KNEE_DB_PARAM = AudioParam.newParamMapper('kneeDb', 30);

  /**
   * `ratioDb` param factory.
   */
  private static RATIO_DB_PARAM = AudioParam.newParamMapper('ratioDb', 12);

  /**
   * `attack` param factory.
   */
  private static ATTACK_PARAM = AudioParam.newParamMapper('attack', 0.0003);

  /**
   * `release` param factory.
   */
  private static RELEASE_PARAM = AudioParam.newParamMapper('release', 0.25);

  /**
   * Creates a new `ExpanderNode` instance.
   */
  constructor(
    id: string,
    public readonly detectionMode: ExpanderNodeDetectionMode,
    public readonly kneeMode: ExpanderNodeKneeMode,
    public readonly cutoffs: number[],
    public readonly thresholdDb: AudioParam,
    public readonly kneeDb: AudioParam,
    public readonly ratioDb: AudioParam,
    public readonly attack: AudioParam,
    public readonly release: AudioParam
  ) {
    super(id, ExpanderNode.PLUGIN_KIND);
  }

  /**
   * `ExpanderNode` factory.
   */
  public static create(
    config: ExpanderNodeConfig,
    id: string = uuid()
  ): ExpanderNode {
    return new ExpanderNode(
      id,
      ExpanderNode.DETECTION_MODE_CONFIG.getValueOrThrow(config.detectionMode),
      ExpanderNode.KNEE_MODE_CONFIG.getValueOrThrow(config.kneeMode),
      ExpanderNode.CUTOFFS_CONFIG.getValueOrThrow(config.cutoffs),
      ExpanderNode.THRESHOLD_DB_PARAM.create(),
      ExpanderNode.KNEE_DB_PARAM.create(),
      ExpanderNode.RATIO_DB_PARAM.create(),
      ExpanderNode.ATTACK_PARAM.create(),
      ExpanderNode.RELEASE_PARAM.create()
    );
  }

  /**
   * Creates a new `ExpanderNode` from a score `Node`.
   */
  public static from(node: Node): ExpanderNode {
    if (ExpanderNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${ExpanderNode.PLUGIN_KIND}"`);
    }
    return new ExpanderNode(
      node.id,
      ExpanderNode.DETECTION_MODE_CONFIG.readConfig(node),
      ExpanderNode.KNEE_MODE_CONFIG.readConfig(node),
      ExpanderNode.CUTOFFS_CONFIG.readConfig(node),
      ExpanderNode.THRESHOLD_DB_PARAM.readParam(node),
      ExpanderNode.KNEE_DB_PARAM.readParam(node),
      ExpanderNode.RATIO_DB_PARAM.readParam(node),
      ExpanderNode.ATTACK_PARAM.readParam(node),
      ExpanderNode.RELEASE_PARAM.readParam(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): ExpanderNodeConfig {
    return {
      detectionMode: this.detectionMode,
      kneeMode: this.kneeMode,
      cutoffs: this.cutoffs
    };
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      thresholdDb: this.thresholdDb.getCommands(),
      kneeDb: this.kneeDb.getCommands(),
      ratioDb: this.ratioDb.getCommands(),
      attack: this.attack.getCommands(),
      release: this.release.getCommands()
    };
  }

  /**
   * Inputs for this node.
   */
  public getInputs(): Map<string, ContentType> {
    return new Map([
      ['audio', ContentType.AUDIO],
      ['sidechain', ContentType.AUDIO]
    ]);
  }

  /**
   * Outputs for this node.
   */
  public getOutputs(): Map<string, ContentType> {
    return new Map([['audio', ContentType.AUDIO]]);
  }
}

/**
 * Export.
 */
export default ExpanderNode;
