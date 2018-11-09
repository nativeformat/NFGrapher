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
      kind: plugin.kind,
      description: plugin.description,
    }))
  };
}

export default function render(def: PluginDef[]): OutputFile {
  const { kinds } = createRenderData(def);
  const filepath = `Sources/Grapher/NodeKind.swift`;
  const content = /* prettier-ignore */ source`
    import Foundation

    /**
        Enumeration of different kinds of nodes.

        ${map(kinds, ({ name, description }) => `- ${name}: ${description}`)}
    */
    public enum NodeKind: String, Codable {
      ${map(kinds, ({ name, kind, description }) => `/// ${description}
      case ${name} = "${kind}"
    `)}}
  `;
  return { filepath, content };
}
