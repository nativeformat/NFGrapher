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
import { camel, constant, pascal } from 'case';
import { source } from 'common-tags';
import { PluginDef } from '../../defs.generated';
import { OutputFile } from '../../interfaces';
import { map } from 'lodash';

function nodeNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

export function createRenderData(def: PluginDef[]) {
  return {
    kinds: map(def, plugin => ({
      name: `${camel(nodeNameFromKind(plugin.kind))}Node`,
      className: `${pascal(nodeNameFromKind(plugin.kind))}Node`,
      kind: plugin.kind,
    }))
  };
}

export default function render(def: PluginDef[]): OutputFile {
  const { kinds } = createRenderData(def);
  const filepath = `Sources/Grapher/Graph.swift`;
  const content = /* prettier-ignore */ source`
    import Foundation

    /// Collection of nodes and how they are connected in a graph.
    public class Graph: Codable {
        private enum CodingKeys: String, CodingKey {
            case id
            case loadingPolicy
            case nodes
            case edges
            case scripts
        }

        private enum NodeKindKey: String, CodingKey {
            case kind
        }

        /// Unique identifier of this graph.
        public let id: String

        /// Loading policy for the nodes in this graph.
        public let loadingPolicy: LoadingPolicy

        /// List of nodes in this graph.
        public var nodes: [Node]

        /// List of edges describing how nodes are connected.
        public var edges: [Edge]

        /// List of scripts applied to this graph.
        public var scripts: [Script]

        /**
            Designated initializer

            - Parameters:
                - id: Unique identifier of this graph.
                - loadingPolicy: Loading policy for the nodes in this graph.
                - nodes: List of nodes in this graph.
                - edges: List of edges describing how nodes are connected.
                - scripts: List of scripts applied to this graph.
         */
        public init(id: String = IDGenerator.generateUniqueID(), loadingPolicy: LoadingPolicy = .allContentPlaythrough, nodes: [Node] = [], edges: [Edge] = [], scripts: [Script] = []) {
            self.id = id
            self.loadingPolicy = loadingPolicy
            self.nodes = nodes
            self.edges = edges
            self.scripts = scripts
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            id = try container.decode(String.self, forKey: .id)
            loadingPolicy = try container.decodeIfPresent(LoadingPolicy.self, forKey: .loadingPolicy) ?? .allContentPlaythrough
            edges = try container.decodeIfPresent([Edge].self, forKey: .edges) ?? []
            scripts = try container.decodeIfPresent([Script].self, forKey: .scripts) ?? []

            var nodesContainerForKind = try container.nestedUnkeyedContainer(forKey: .nodes)
            var nodesContainer = nodesContainerForKind

            var nodes: [Node] = []

            while(!nodesContainerForKind.isAtEnd) {
                let node = try nodesContainerForKind.nestedContainer(keyedBy: NodeKindKey.self)
                let nodeKind = try node.decode(NodeKind.self, forKey: .kind)

                switch nodeKind {
                ${map(kinds, ({ name, className }) => `case .${name}:
                    nodes.append(try nodesContainer.decode(${className}.self))`)}
                }
            }

            self.nodes = nodes
        }

        public func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try container.encode(id, forKey: .id)
            try container.encode(loadingPolicy, forKey: .loadingPolicy)
            try container.encode(edges, forKey: .edges)
            try container.encode(scripts, forKey: .scripts)
            try container.encode(nodes, forKey: .nodes)
        }
    }
  `;
  return { filepath, content };
}
