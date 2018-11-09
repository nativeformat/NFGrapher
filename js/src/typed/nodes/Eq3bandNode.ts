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
 * Eq3bandNode.
 */
class Eq3bandNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.eq.eq3band';

  /**
   * `lowCutoff` param factory.
   */
  private static LOW_CUTOFF_PARAM = AudioParam.newParamMapper('lowCutoff', 264);

  /**
   * `midFrequency` param factory.
   */
  private static MID_FREQUENCY_PARAM = AudioParam.newParamMapper(
    'midFrequency',
    1000
  );

  /**
   * `highCutoff` param factory.
   */
  private static HIGH_CUTOFF_PARAM = AudioParam.newParamMapper(
    'highCutoff',
    3300
  );

  /**
   * `lowGain` param factory.
   */
  private static LOW_GAIN_PARAM = AudioParam.newParamMapper('lowGain', 0);

  /**
   * `midGain` param factory.
   */
  private static MID_GAIN_PARAM = AudioParam.newParamMapper('midGain', 0);

  /**
   * `highGain` param factory.
   */
  private static HIGH_GAIN_PARAM = AudioParam.newParamMapper('highGain', 0);

  /**
   * Creates a new `Eq3bandNode` instance.
   */
  constructor(
    id: string,
    public readonly lowCutoff: AudioParam,
    public readonly midFrequency: AudioParam,
    public readonly highCutoff: AudioParam,
    public readonly lowGain: AudioParam,
    public readonly midGain: AudioParam,
    public readonly highGain: AudioParam
  ) {
    super(id, Eq3bandNode.PLUGIN_KIND);
  }

  /**
   * `Eq3bandNode` factory.
   */
  public static create(id: string = uuid()): Eq3bandNode {
    return new Eq3bandNode(
      id,
      Eq3bandNode.LOW_CUTOFF_PARAM.create(),
      Eq3bandNode.MID_FREQUENCY_PARAM.create(),
      Eq3bandNode.HIGH_CUTOFF_PARAM.create(),
      Eq3bandNode.LOW_GAIN_PARAM.create(),
      Eq3bandNode.MID_GAIN_PARAM.create(),
      Eq3bandNode.HIGH_GAIN_PARAM.create()
    );
  }

  /**
   * Creates a new `Eq3bandNode` from a score `Node`.
   */
  public static from(node: Node): Eq3bandNode {
    if (Eq3bandNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${Eq3bandNode.PLUGIN_KIND}"`);
    }
    return new Eq3bandNode(
      node.id,
      Eq3bandNode.LOW_CUTOFF_PARAM.readParam(node),
      Eq3bandNode.MID_FREQUENCY_PARAM.readParam(node),
      Eq3bandNode.HIGH_CUTOFF_PARAM.readParam(node),
      Eq3bandNode.LOW_GAIN_PARAM.readParam(node),
      Eq3bandNode.MID_GAIN_PARAM.readParam(node),
      Eq3bandNode.HIGH_GAIN_PARAM.readParam(node)
    );
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      lowCutoff: this.lowCutoff.getCommands(),
      midFrequency: this.midFrequency.getCommands(),
      highCutoff: this.highCutoff.getCommands(),
      lowGain: this.lowGain.getCommands(),
      midGain: this.midGain.getCommands(),
      highGain: this.highGain.getCommands()
    };
  }

  /**
   * Inputs for this node.
   */
  public getInputs(): Map<string, ContentType> {
    return new Map([['audio', ContentType.AUDIO]]);
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
export default Eq3bandNode;
