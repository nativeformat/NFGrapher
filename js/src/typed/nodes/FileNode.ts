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
 * FileNodeConfig.
 */
export interface FileNodeConfig {
  file: string;
  when?: number;
  duration?: number;
  offset?: number;
}

/**
 * FileNode.
 */
class FileNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.file.file';

  /**
   * Creates a new `string` mapper for the `file` param.
   */
  private static FILE_CONFIG = ArgMapper.newStringArg('file', undefined);

  /**
   * Creates a new `number` mapper for the `when` param.
   */
  private static WHEN_CONFIG = ArgMapper.newTimeArg('when', 0);

  /**
   * Creates a new `number` mapper for the `duration` param.
   */
  private static DURATION_CONFIG = ArgMapper.newTimeArg('duration', 0);

  /**
   * Creates a new `number` mapper for the `offset` param.
   */
  private static OFFSET_CONFIG = ArgMapper.newTimeArg('offset', 0);

  /**
   * Creates a new `FileNode` instance.
   */
  constructor(
    id: string,
    public readonly file: string,
    public readonly when: number,
    public readonly duration: number,
    public readonly offset: number
  ) {
    super(id, FileNode.PLUGIN_KIND);
  }

  /**
   * `FileNode` factory.
   */
  public static create(config: FileNodeConfig, id: string = uuid()): FileNode {
    return new FileNode(
      id,
      FileNode.FILE_CONFIG.getValueOrThrow(config.file),
      FileNode.WHEN_CONFIG.getValueOrThrow(config.when),
      FileNode.DURATION_CONFIG.getValueOrThrow(config.duration),
      FileNode.OFFSET_CONFIG.getValueOrThrow(config.offset)
    );
  }

  /**
   * Creates a new `FileNode` from a score `Node`.
   */
  public static from(node: Node): FileNode {
    if (FileNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${FileNode.PLUGIN_KIND}"`);
    }
    return new FileNode(
      node.id,
      FileNode.FILE_CONFIG.readConfig(node),
      FileNode.WHEN_CONFIG.readConfig(node),
      FileNode.DURATION_CONFIG.readConfig(node),
      FileNode.OFFSET_CONFIG.readConfig(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): FileNodeConfig {
    return {
      file: this.file,
      when: this.when,
      duration: this.duration,
      offset: this.offset
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
export default FileNode;
