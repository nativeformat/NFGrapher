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
 * CompressorNodeDetectionMode.
 */
export enum CompressorNodeDetectionMode {
  MAX = 'max',
  RMS = 'rms'
}
/**
 * CompressorNodeKneeMode.
 */
export enum CompressorNodeKneeMode {
  HARD = 'hard',
  SOFT = 'soft'
}

/**
 * CompressorNodeConfig.
 */
export interface CompressorNodeConfig {
  detectionMode?: CompressorNodeDetectionMode;
  kneeMode?: CompressorNodeKneeMode;
  cutoffs?: number[];
}

/**
 * CompressorNode.
 */
class CompressorNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.compressor.compressor';

  /**
   * Creates a new `string` mapper for the `detectionMode` param.
   */
  private static DETECTION_MODE_CONFIG = ArgMapper.newEnumArg<
    CompressorNodeDetectionMode
  >(
    'detectionMode',
    CompressorNodeDetectionMode.MAX,
    Object.values(CompressorNodeDetectionMode)
  );

  /**
   * Creates a new `string` mapper for the `kneeMode` param.
   */
  private static KNEE_MODE_CONFIG = ArgMapper.newEnumArg<
    CompressorNodeKneeMode
  >(
    'kneeMode',
    CompressorNodeKneeMode.HARD,
    Object.values(CompressorNodeKneeMode)
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
   * Creates a new `CompressorNode` instance.
   */
  constructor(
    id: string,
    public readonly detectionMode: CompressorNodeDetectionMode,
    public readonly kneeMode: CompressorNodeKneeMode,
    public readonly cutoffs: number[],
    public readonly thresholdDb: AudioParam,
    public readonly kneeDb: AudioParam,
    public readonly ratioDb: AudioParam,
    public readonly attack: AudioParam,
    public readonly release: AudioParam
  ) {
    super(id, CompressorNode.PLUGIN_KIND);
  }

  /**
   * `CompressorNode` factory.
   */
  public static create(
    config: CompressorNodeConfig,
    id: string = uuid()
  ): CompressorNode {
    return new CompressorNode(
      id,
      CompressorNode.DETECTION_MODE_CONFIG.getValueOrThrow(
        config.detectionMode
      ),
      CompressorNode.KNEE_MODE_CONFIG.getValueOrThrow(config.kneeMode),
      CompressorNode.CUTOFFS_CONFIG.getValueOrThrow(config.cutoffs),
      CompressorNode.THRESHOLD_DB_PARAM.create(),
      CompressorNode.KNEE_DB_PARAM.create(),
      CompressorNode.RATIO_DB_PARAM.create(),
      CompressorNode.ATTACK_PARAM.create(),
      CompressorNode.RELEASE_PARAM.create()
    );
  }

  /**
   * Creates a new `CompressorNode` from a score `Node`.
   */
  public static from(node: Node): CompressorNode {
    if (CompressorNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${CompressorNode.PLUGIN_KIND}"`);
    }
    return new CompressorNode(
      node.id,
      CompressorNode.DETECTION_MODE_CONFIG.readConfig(node),
      CompressorNode.KNEE_MODE_CONFIG.readConfig(node),
      CompressorNode.CUTOFFS_CONFIG.readConfig(node),
      CompressorNode.THRESHOLD_DB_PARAM.readParam(node),
      CompressorNode.KNEE_DB_PARAM.readParam(node),
      CompressorNode.RATIO_DB_PARAM.readParam(node),
      CompressorNode.ATTACK_PARAM.readParam(node),
      CompressorNode.RELEASE_PARAM.readParam(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): CompressorNodeConfig {
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
export default CompressorNode;
