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
import { ContractDef } from '../../defs.generated';
import { asList } from '../../utils';
import { source } from 'common-tags';
import { pascal } from 'case';
import { map } from 'lodash';

function exportClass(className: string): string {
  return `
    import { default as ${className} } from './${className}';
    export * from './${className}';
    export { ${className} };
  `;
}

export function createRenderData(def: ContractDef) {
  return {
    nodes: map(def.pluginDefs, def => ({
      className: `${pascal(`${def.kind.split('.').pop()}`)}Node`,
      kind: def.kind
    })),
    params: map(def.paramKindDefs, def => ({
      className: `${pascal(def.kind)}Param`,
      kind: def.kind
    }))
  };
}

export default function render(contractDef: ContractDef): OutputFile[] {
  const { nodes, params } = createRenderData(contractDef);
  return [
    {
      filepath: `typed/nodes/index.ts`,
      content: /* prettier-ignore */ source`
        ${map(nodes, node => source`
        import { default as ${node.className} } from './${node.className}';
        `)}
        export { default as TypedNode } from './TypedNode';
        /**
         * Map of Node kinds to typed classes.
         */
        export const NodeKinds = {
          ${asList(map(nodes, ({ kind, className }) => `
          '${kind}': ${className}
          `))}
        }
        /**
         * Export Node config interfaces.
         */
        ${map(nodes, ({ className }) => source`
        export * from './${className}';
        `)}
        /**
         * Export Node types.
         */
        export {
          ${asList(map(nodes, 'className'))}
        };
      `
    },
    {
      filepath: `typed/params/index.ts`,
      content: /* prettier-ignore */ source`
        ${map(params, ({ className }) => `
          export * from './${className}';
          export { default as ${className} } from './${className}';
        `)}
      `
    }
  ];
}
