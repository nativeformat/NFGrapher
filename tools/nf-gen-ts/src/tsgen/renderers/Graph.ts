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
import { OutputFile } from '../../interfaces';
import { PluginDef } from '../../defs.generated';
import { asList } from '../../utils';
import { source } from 'common-tags';
import { pascal } from 'case';
import { map } from 'lodash';

export function createRenderData(pluginDefs: PluginDef[]) {
  return {
    nodes: map(pluginDefs, def => ({
      className: `${pascal(`${def.kind.split('.').pop()}`)}Node`,
      kind: def.kind
    }))
  };
}

export default function render(pluginDefs: PluginDef[]): OutputFile {
  const { nodes } = createRenderData(pluginDefs);
  const filepath = 'score/Graph.ts';
  const content = /* prettier-ignore */ source`
    import { ${asList(map(nodes, 'className'))} } from '../typed/nodes';
    import { Graph as IGraph, Node, Edge, Script, LoadingPolicy } from './interfaces';
    import { v4 as uuid } from 'uuid';

    function nodeMapper(node: Node): Node {
      switch (node.kind) {
        ${map(nodes, node => source`
        case '${node.kind}':
          return ${node.className}.from(node);
        `)}
        default:
          throw new Error(\`Unknown node kind="\${node.kind}"\`);
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
  `;
  return { filepath, content };
}
