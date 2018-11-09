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

import {
  Eq3bandNode,
  FileNode,
  NoiseNode,
  SilenceNode,
  LoopNode,
  StretchNode,
  DelayNode,
  GainNode,
  SineNode,
  FilterNode,
  CompressorNode,
  ExpanderNode,
  CompanderNode
} from '../typed/nodes';
import {
  Graph as IGraph,
  Node,
  Edge,
  Script,
  LoadingPolicy
} from './interfaces';
import { v4 as uuid } from 'uuid';

function nodeMapper(node: Node): Node {
  switch (node.kind) {
    case 'com.nativeformat.plugin.eq.eq3band':
      return Eq3bandNode.from(node);
    case 'com.nativeformat.plugin.file.file':
      return FileNode.from(node);
    case 'com.nativeformat.plugin.noise.noise':
      return NoiseNode.from(node);
    case 'com.nativeformat.plugin.noise.silence':
      return SilenceNode.from(node);
    case 'com.nativeformat.plugin.time.loop':
      return LoopNode.from(node);
    case 'com.nativeformat.plugin.time.stretch':
      return StretchNode.from(node);
    case 'com.nativeformat.plugin.waa.delay':
      return DelayNode.from(node);
    case 'com.nativeformat.plugin.waa.gain':
      return GainNode.from(node);
    case 'com.nativeformat.plugin.wave.sine':
      return SineNode.from(node);
    case 'com.nativeformat.plugin.eq.filter':
      return FilterNode.from(node);
    case 'com.nativeformat.plugin.compressor.compressor':
      return CompressorNode.from(node);
    case 'com.nativeformat.plugin.compressor.expander':
      return ExpanderNode.from(node);
    case 'com.nativeformat.plugin.compressor.compander':
      return CompanderNode.from(node);
    default:
      throw new Error(`Unknown node kind="${node.kind}"`);
  }
}

class Graph implements IGraph {
  constructor(
    public id: string = uuid(),
    public loadingPolicy = LoadingPolicy.AllContentPlaythrough,
    public nodes: Node[] = [],
    public edges: Edge[] = [],
    public scripts: Script[] = []
  ) {}
  public static from(graph: IGraph): Graph {
    return new Graph(
      graph.id,
      graph.loadingPolicy,
      graph.nodes && graph.nodes.map(nodeMapper),
      graph.edges,
      graph.scripts
    );
  }
}

export default Graph;
