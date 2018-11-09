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
 * DelayNode.
 */
class DelayNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.waa.delay';

  /**
   * `delayTime` param factory.
   */
  private static DELAY_TIME_PARAM = AudioParam.newParamMapper('delayTime', 0);

  /**
   * Creates a new `DelayNode` instance.
   */
  constructor(id: string, public readonly delayTime: AudioParam) {
    super(id, DelayNode.PLUGIN_KIND);
  }

  /**
   * `DelayNode` factory.
   */
  public static create(id: string = uuid()): DelayNode {
    return new DelayNode(id, DelayNode.DELAY_TIME_PARAM.create());
  }

  /**
   * Creates a new `DelayNode` from a score `Node`.
   */
  public static from(node: Node): DelayNode {
    if (DelayNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${DelayNode.PLUGIN_KIND}"`);
    }
    return new DelayNode(node.id, DelayNode.DELAY_TIME_PARAM.readParam(node));
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      delayTime: this.delayTime.getCommands()
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
export default DelayNode;
