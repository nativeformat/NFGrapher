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
 * SineNodeConfig.
 */
export interface SineNodeConfig {
  frequency?: number;
  when?: number;
  duration?: number;
}

/**
 * SineNode.
 */
class SineNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.wave.sine';

  /**
   * Creates a new `number` mapper for the `frequency` param.
   */
  private static FREQUENCY_CONFIG = ArgMapper.newFloatArg('frequency', 0);

  /**
   * Creates a new `number` mapper for the `when` param.
   */
  private static WHEN_CONFIG = ArgMapper.newTimeArg('when', 0);

  /**
   * Creates a new `number` mapper for the `duration` param.
   */
  private static DURATION_CONFIG = ArgMapper.newTimeArg('duration', 0);

  /**
   * Creates a new `SineNode` instance.
   */
  constructor(
    id: string,
    public readonly frequency: number,
    public readonly when: number,
    public readonly duration: number
  ) {
    super(id, SineNode.PLUGIN_KIND);
  }

  /**
   * `SineNode` factory.
   */
  public static create(config: SineNodeConfig, id: string = uuid()): SineNode {
    return new SineNode(
      id,
      SineNode.FREQUENCY_CONFIG.getValueOrThrow(config.frequency),
      SineNode.WHEN_CONFIG.getValueOrThrow(config.when),
      SineNode.DURATION_CONFIG.getValueOrThrow(config.duration)
    );
  }

  /**
   * Creates a new `SineNode` from a score `Node`.
   */
  public static from(node: Node): SineNode {
    if (SineNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${SineNode.PLUGIN_KIND}"`);
    }
    return new SineNode(
      node.id,
      SineNode.FREQUENCY_CONFIG.readConfig(node),
      SineNode.WHEN_CONFIG.readConfig(node),
      SineNode.DURATION_CONFIG.readConfig(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): SineNodeConfig {
    return {
      frequency: this.frequency,
      when: this.when,
      duration: this.duration
    };
  }

  /**
   * Inputs for this node.
   */
  public getInputs(): Map<string, ContentType> {
    return new Map([]);
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
export default SineNode;
