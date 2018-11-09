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
 * StretchNode.
 */
class StretchNode extends TypedNode {
  /**
   * Unique identifier for the plugin kind this node represents.
   */
  public static PLUGIN_KIND = 'com.nativeformat.plugin.time.stretch';

  /**
   * `pitchRatio` param factory.
   */
  private static PITCH_RATIO_PARAM = AudioParam.newParamMapper('pitchRatio', 1);

  /**
   * `stretch` param factory.
   */
  private static STRETCH_PARAM = AudioParam.newParamMapper('stretch', 1);

  /**
   * `formantRatio` param factory.
   */
  private static FORMANT_RATIO_PARAM = AudioParam.newParamMapper(
    'formantRatio',
    1
  );

  /**
   * Creates a new `StretchNode` instance.
   */
  constructor(
    id: string,
    public readonly pitchRatio: AudioParam,
    public readonly stretch: AudioParam,
    public readonly formantRatio: AudioParam
  ) {
    super(id, StretchNode.PLUGIN_KIND);
  }

  /**
   * `StretchNode` factory.
   */
  public static create(id: string = uuid()): StretchNode {
    return new StretchNode(
      id,
      StretchNode.PITCH_RATIO_PARAM.create(),
      StretchNode.STRETCH_PARAM.create(),
      StretchNode.FORMANT_RATIO_PARAM.create()
    );
  }

  /**
   * Creates a new `StretchNode` from a score `Node`.
   */
  public static from(node: Node): StretchNode {
    if (StretchNode.PLUGIN_KIND !== node.kind) {
      throw new Error(`Expected plugin kind="${StretchNode.PLUGIN_KIND}"`);
    }
    return new StretchNode(
      node.id,
      StretchNode.PITCH_RATIO_PARAM.readParam(node),
      StretchNode.STRETCH_PARAM.readParam(node),
      StretchNode.FORMANT_RATIO_PARAM.readParam(node)
    );
  }

  /**
   * Params for this node.
   */
  public getParams(): { [key: string]: Command[] } {
    return {
      pitchRatio: this.pitchRatio.getCommands(),
      stretch: this.stretch.getCommands(),
      formantRatio: this.formantRatio.getCommands()
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
export default StretchNode;
