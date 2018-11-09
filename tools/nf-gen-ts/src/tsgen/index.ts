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
import { default as renderParamClass } from './renderers/ParamClass';
import { default as renderNodeClass } from './renderers/NodeClass';
import { default as renderModule } from './renderers/Module';
import { default as renderGraph } from './renderers/Graph';
import { default as renderScore } from './renderers/Score';
import { default as renderScoreInterfaces } from './renderers/ScoreInterfaces';
import { flatMap } from 'lodash';
import { ContractDef } from '../defs.generated';
import { OutputFile } from '../interfaces';
import { format as pretty } from 'prettier';

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
// under the License.

/* Generated */`

function format(file: OutputFile): OutputFile {
  file.content = pretty(`${LICENSE_HEADER}\n\n ${file.content}`, {
    parser: 'typescript',
    singleQuote: true
  });
  return file;
}

export async function render(
  contractDef: ContractDef,
  scoreSchema: any
): Promise<OutputFile[]> {
  const scoreFiles = await renderScoreInterfaces(scoreSchema);
  return flatMap([
    ...scoreFiles,
    ...contractDef.pluginDefs.map(renderNodeClass),
    ...contractDef.paramKindDefs.map(renderParamClass),
    ...renderModule(contractDef),
    renderGraph(contractDef.pluginDefs),
    renderScore(contractDef)
  ]).map(format);
}
