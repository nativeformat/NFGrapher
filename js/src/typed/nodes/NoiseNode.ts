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
 * NoiseNodeConfig.
 */
export interface NoiseNodeConfig {
  when?: number;
  duration?: number;
}

/**
 * NoiseNode.
 */
class NoiseNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.noise.noise';

  /**
   * Creates a new `number` mapper for the `when` param.
   */
  private static WHEN_CONFIG = ArgMapper.newTimeArg('when', 0);

  /**
   * Creates a new `number` mapper for the `duration` param.
   */
  private static DURATION_CONFIG = ArgMapper.newTimeArg('duration', 0);

  /**
   * Creates a new `NoiseNode` instance.
   */
  constructor(
    id: string,
    public readonly when: number,
    public readonly duration: number
  ) {
    super(id, NoiseNode.PLUGIN_KIND);
  }

  /**
   * `NoiseNode` factory.
   */
  public static create(
    config: NoiseNodeConfig,
    id: string = uuid()
  ): NoiseNode {
    return new NoiseNode(
      id,
      NoiseNode.WHEN_CONFIG.getValueOrThrow(config.when),
      NoiseNode.DURATION_CONFIG.getValueOrThrow(config.duration)
    );
  }

  /**
   * Creates a new `NoiseNode` from a score `Node`.
   */
  public static from(node: Node): NoiseNode {
    if (NoiseNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${NoiseNode.PLUGIN_KIND}"`);
    }
    return new NoiseNode(
      node.id,
      NoiseNode.WHEN_CONFIG.readConfig(node),
      NoiseNode.DURATION_CONFIG.readConfig(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): NoiseNodeConfig {
    return {
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
export default NoiseNode;
