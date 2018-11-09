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
import { ContractDef } from '../defs.generated';
import { OutputFile } from '../interfaces';
import { default as renderNodeKind } from './renderers/NodeKind';
import { default as renderVersion } from './renderers/Version';
import { default as renderGraph } from './renderers/Graph';
import { default as renderNodeClass } from './renderers/NodeClass';
import { default as renderParamClass } from './renderers/ParamClass';
import { default as renderParamCommands } from './renderers/ParamCommands';

const LICENSE_HEADER = `// Copyright (c) 2018 Spotify AB.
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
// under the License`;

export async function render(
  contractDef: ContractDef,
  scoreSchema: any
): Promise<OutputFile[]> {
  return [
    renderNodeKind(contractDef.pluginDefs),
    renderVersion(contractDef.version),
    renderGraph(contractDef.pluginDefs),
    ...contractDef.pluginDefs.map(renderNodeClass),
    ...contractDef.paramKindDefs.map(renderParamClass),
    ...contractDef.paramKindDefs.map(renderParamCommands),
  ].map(f => ({ ...f, content: `${LICENSE_HEADER}\n\n/* Generated */\n\n${f.content}` }));
}
