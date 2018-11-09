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

/**
 * LoopNodeConfig.
 */
export interface LoopNodeConfig {
  when: number;
  duration: number;
  loopCount?: number;
}

/**
 * LoopNode.
 */
class LoopNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.time.loop';

  /**
   * Creates a new `number` mapper for the `when` param.
   */
  private static WHEN_CONFIG = ArgMapper.newTimeArg('when', undefined);

  /**
   * Creates a new `number` mapper for the `duration` param.
   */
  private static DURATION_CONFIG = ArgMapper.newTimeArg('duration', undefined);

  /**
   * Creates a new `number` mapper for the `loopCount` param.
   */
  private static LOOP_COUNT_CONFIG = ArgMapper.newIntArg('loopCount', -1);

  /**
   * Creates a new `LoopNode` instance.
   */
  constructor(
    id: string,
    public readonly when: number,
    public readonly duration: number,
    public readonly loopCount: number
  ) {
    super(id, LoopNode.PLUGIN_KIND);
  }

  /**
   * `LoopNode` factory.
   */
  public static create(config: LoopNodeConfig, id: string = uuid()): LoopNode {
    return new LoopNode(
      id,
      LoopNode.WHEN_CONFIG.getValueOrThrow(config.when),
      LoopNode.DURATION_CONFIG.getValueOrThrow(config.duration),
      LoopNode.LOOP_COUNT_CONFIG.getValueOrThrow(config.loopCount)
    );
  }

  /**
   * Creates a new `LoopNode` from a score `Node`.
   */
  public static from(node: Node): LoopNode {
    if (LoopNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${LoopNode.PLUGIN_KIND}"`);
    }
    return new LoopNode(
      node.id,
      LoopNode.WHEN_CONFIG.readConfig(node),
      LoopNode.DURATION_CONFIG.readConfig(node),
      LoopNode.LOOP_COUNT_CONFIG.readConfig(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): LoopNodeConfig {
    return {
      when: this.when,
      duration: this.duration,
      loopCount: this.loopCount
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
export default LoopNode;
