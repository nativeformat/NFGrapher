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
 * FilterNodeFilterType.
 */
export enum FilterNodeFilterType {
  LOW_PASS = 'lowPass',
  HIGH_PASS = 'highPass',
  BAND_PASS = 'bandPass'
}

/**
 * FilterNodeConfig.
 */
export interface FilterNodeConfig {
  filterType?: FilterNodeFilterType;
}

/**
 * FilterNode.
 */
class FilterNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.eq.filter';

  /**
   * Creates a new `string` mapper for the `filterType` param.
   */
  private static FILTER_TYPE_CONFIG = ArgMapper.newEnumArg<
    FilterNodeFilterType
  >(
    'filterType',
    FilterNodeFilterType.BAND_PASS,
    Object.values(FilterNodeFilterType)
  );

  /**
   * `lowCutoff` param factory.
   */
  private static LOW_CUTOFF_PARAM = AudioParam.newParamMapper('lowCutoff', 0);

  /**
   * `highCutoff` param factory.
   */
  private static HIGH_CUTOFF_PARAM = AudioParam.newParamMapper(
    'highCutoff',
    22050
  );

  /**
   * Creates a new `FilterNode` instance.
   */
  constructor(
    id: string,
    public readonly filterType: FilterNodeFilterType,
    public readonly lowCutoff: AudioParam,
    public readonly highCutoff: AudioParam
  ) {
    super(id, FilterNode.PLUGIN_KIND);
  }

  /**
   * `FilterNode` factory.
   */
  public static create(
    config: FilterNodeConfig,
    id: string = uuid()
  ): FilterNode {
    return new FilterNode(
      id,
      FilterNode.FILTER_TYPE_CONFIG.getValueOrThrow(config.filterType),
      FilterNode.LOW_CUTOFF_PARAM.create(),
      FilterNode.HIGH_CUTOFF_PARAM.create()
    );
  }

  /**
   * Creates a new `FilterNode` from a score `Node`.
   */
  public static from(node: Node): FilterNode {
    if (FilterNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${FilterNode.PLUGIN_KIND}"`);
    }
    return new FilterNode(
      node.id,
      FilterNode.FILTER_TYPE_CONFIG.readConfig(node),
      FilterNode.LOW_CUTOFF_PARAM.readParam(node),
      FilterNode.HIGH_CUTOFF_PARAM.readParam(node)
    );
  }

  /**
   * Configs for this node.
   */
  public getConfig(): FilterNodeConfig {
    return {
      filterType: this.filterType
    };
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      lowCutoff: this.lowCutoff.getCommands(),
      highCutoff: this.highCutoff.getCommands()
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
export default FilterNode;
