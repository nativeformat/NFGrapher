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
 * CompanderNodeDetectionMode.
 */
export enum CompanderNodeDetectionMode {
  MAX = 'max',
  RMS = 'rms'
}
/**
 * CompanderNodeKneeMode.
 */
export enum CompanderNodeKneeMode {
  HARD = 'hard',
  SOFT = 'soft'
}

/**
 * CompanderNodeConfig.
 */
export interface CompanderNodeConfig {
  detectionMode?: CompanderNodeDetectionMode;
  kneeMode?: CompanderNodeKneeMode;
  cutoffs?: number[];
}

/**
 * CompanderNode.
 */
class CompanderNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.compressor.compander';

  /**
   * Creates a new `string` mapper for the `detectionMode` param.
   */
  private static DETECTION_MODE_CONFIG = ArgMapper.newEnumArg<
    CompanderNodeDetectionMode
  >(
    'detectionMode',
    CompanderNodeDetectionMode.MAX,
    Object.values(CompanderNodeDetectionMode)
  );

  /**
   * Creates a new `string` mapper for the `kneeMode` param.
   */
  private static KNEE_MODE_CONFIG = ArgMapper.newEnumArg<CompanderNodeKneeMode>(
    'kneeMode',
    CompanderNodeKneeMode.HARD,
    Object.values(CompanderNodeKneeMode)
  );

  /**
   * Creates a new `number[]` mapper for the `cutoffs` param.
   */
  private static CUTOFFS_CONFIG = ArgMapper.newFloatListArg('cutoffs', []);

  /**
   * `compressorThresholdDb` param factory.
   */
  private static COMPRESSOR_THRESHOLD_DB_PARAM = AudioParam.newParamMapper(
    'compressorThresholdDb',
    -24
  );

  /**
   * `compressorKneeDb` param factory.
   */
  private static COMPRESSOR_KNEE_DB_PARAM = AudioParam.newParamMapper(
    'compressorKneeDb',
    30
  );

  /**
   * `compressorRatioDb` param factory.
   */
  private static COMPRESSOR_RATIO_DB_PARAM = AudioParam.newParamMapper(
    'compressorRatioDb',
    12
  );

  /**
   * `expanderThresholdDb` param factory.
   */
  private static EXPANDER_THRESHOLD_DB_PARAM = AudioParam.newParamMapper(
    'expanderThresholdDb',
    -24
  );

  /**
   * `expanderKneeDb` param factory.
   */
  private static EXPANDER_KNEE_DB_PARAM = AudioParam.newParamMapper(
    'expanderKneeDb',
    30
  );

  /**
   * `expanderRatioDb` param factory.
   */
  private static EXPANDER_RATIO_DB_PARAM = AudioParam.newParamMapper(
    'expanderRatioDb',
    12
  );

  /**
   * `attack` param factory.
   */
  private static ATTACK_PARAM = AudioParam.newParamMapper('attack', 0.0003);

  /**
   * `release` param factory.
   */
  private static RELEASE_PARAM = AudioParam.newParamMapper('release', 0.25);

  /**
   * Creates a new `CompanderNode` instance.
   */
  constructor(
    id: string,
    public readonly detectionMode: CompanderNodeDetectionMode,
    public readonly kneeMode: CompanderNodeKneeMode,
    public readonly cutoffs: number[],
    public readonly compressorThresholdDb: AudioParam,
    public readonly compressorKneeDb: AudioParam,
    public readonly compressorRatioDb: AudioParam,
    public readonly expanderThresholdDb: AudioParam,
    public readonly expanderKneeDb: AudioParam,
    public readonly expanderRatioDb: AudioParam,
    public readonly attack: AudioParam,
    public readonly release: AudioParam
  ) {
    super(id, CompanderNode.PLUGIN_KIND);
  }

  /**
   * `CompanderNode` factory.
   */
  public static create(
    config: CompanderNodeConfig,
    id: string = uuid()
  ): CompanderNode {
    return new CompanderNode(
      id,
      CompanderNode.DETECTION_MODE_CONFIG.getValueOrThrow(config.detectionMode),
      CompanderNode.KNEE_MODE_CONFIG.getValueOrThrow(config.kneeMode),
      CompanderNode.CUTOFFS_CONFIG.getValueOrThrow(config.cutoffs),
      CompanderNode.COMPRESSOR_THRESHOLD_DB_PARAM.create(),
      CompanderNode.COMPRESSOR_KNEE_DB_PARAM.create(),
      CompanderNode.COMPRESSOR_RATIO_DB_PARAM.create(),
      CompanderNode.EXPANDER_THRESHOLD_DB_PARAM.create(),
      CompanderNode.EXPANDER_KNEE_DB_PARAM.create(),
      CompanderNode.EXPANDER_RATIO_DB_PARAM.create(),
      CompanderNode.ATTACK_PARAM.create(),
      CompanderNode.RELEASE_PARAM.create()
    );
  }

  /**
   * Creates a new `CompanderNode` from a score `Node`.
   */
  public static from(node: Node): CompanderNode {
    if (CompanderNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${CompanderNode.PLUGIN_KIND}"`);
    }
    return new CompanderNode(
      node.id,
      CompanderNode.DETECTION_MODE_CONFIG.readConfig(node),
      CompanderNode.KNEE_MODE_CONFIG.readConfig(node),
      CompanderNode.CUTOFFS_CONFIG.readConfig(node),
      CompanderNode.COMPRESSOR_THRESHOLD_DB_PARAM.readParam(node),
      CompanderNode.COMPRESSOR_KNEE_DB_PARAM.readParam(node),
      CompanderNode.COMPRESSOR_RATIO_DB_PARAM.readParam(node),
      CompanderNode.EXPANDER_THRESHOLD_DB_PARAM.readParam(node),
      CompanderNode.EXPANDER_KNEE_DB_PARAM.readParam(node),
      CompanderNode.EXPANDER_RATIO_DB_PARAM.readParam(node),
      CompanderNode.ATTACK_PARAM.readParam(node),
      CompanderNode.RELEASE_PARAM.readParam(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): CompanderNodeConfig {
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
      compressorThresholdDb: this.compressorThresholdDb.getCommands(),
      compressorKneeDb: this.compressorKneeDb.getCommands(),
      compressorRatioDb: this.compressorRatioDb.getCommands(),
      expanderThresholdDb: this.expanderThresholdDb.getCommands(),
      expanderKneeDb: this.expanderKneeDb.getCommands(),
      expanderRatioDb: this.expanderRatioDb.getCommands(),
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
export default CompanderNode;
