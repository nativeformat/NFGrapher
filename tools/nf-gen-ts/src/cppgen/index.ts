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
import { source } from 'common-tags';
import * as path from 'path';
import { ContractDef } from '../defs.generated';
import { OutputFile } from '../interfaces';
import { renderNode, renderNodeImports } from './renderers/Node';
import { renderParamImport, renderParams } from './renderers/Param';
import { renderScore, renderScoreImport } from './renderers/Score';

const LICENSE_HEADER = `/*
 * Copyright (c) 2018 Spotify AB.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */`

function addGeneratedComment(file: OutputFile): OutputFile {
  file.content = `${LICENSE_HEADER}\n\n/* Generated */\n\n${file.content}`;
  return file;
}

export async function render(
  contractDef: ContractDef,
  scoreSchema: any
): Promise<OutputFile[]> {
  const score = await renderScore(scoreSchema);
  const nodeHeaders = contractDef.pluginDefs.map(renderNode);
  const paramHeader = renderParams(contractDef.paramKindDefs);

  const scoreImport = renderScoreImport();
  const nodeImports = renderNodeImports(contractDef.pluginDefs);
  const paramImport = renderParamImport();

  const mainHeaderPath = path.join('include', 'NFGrapher', 'NFGrapher.h');
  const mainHeaderContent = source`
    #pragma once

    ${scoreImport}
    ${paramImport}
    ${nodeImports}

    namespace nfgrapher {
      inline constexpr const char* version() { return "${contractDef.version}"; }
    } // namespace nfgrapher

  `;
  const mainHeader: OutputFile = {filepath: mainHeaderPath, content: mainHeaderContent};

  return [
    ...score,
    ...nodeHeaders,
    paramHeader,
    mainHeader
  ].map(addGeneratedComment);
}
