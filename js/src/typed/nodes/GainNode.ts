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
 * GainNode.
 */
class GainNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.waa.gain';

  /**
   * `gain` param factory.
   */
  private static GAIN_PARAM = AudioParam.newParamMapper('gain', 1);

  /**
   * Creates a new `GainNode` instance.
   */
  constructor(id: string, public readonly gain: AudioParam) {
    super(id, GainNode.PLUGIN_KIND);
  }

  /**
   * `GainNode` factory.
   */
  public static create(id: string = uuid()): GainNode {
    return new GainNode(id, GainNode.GAIN_PARAM.create());
  }

  /**
   * Creates a new `GainNode` from a score `Node`.
   */
  public static from(node: Node): GainNode {
    if (GainNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${GainNode.PLUGIN_KIND}"`);
    }
    return new GainNode(node.id, GainNode.GAIN_PARAM.readParam(node));
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      gain: this.gain.getCommands()
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
export default GainNode;
