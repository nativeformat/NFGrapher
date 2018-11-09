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
import { ContractDef } from '../../defs.generated';
import { pascal } from 'case';
import { OutputFile } from '../../interfaces';
import { source } from 'common-tags';
import {
  exampleForCommand,
  exampleForPlugin,
  json,
  makeArgumentsTable,
  makeParamsTable
} from '../helpers';
import { isEmpty, map } from 'lodash';
// tslint:disable:no-var-requires
const toc = require('markdown-toc');

export default function render(contractDef: ContractDef): OutputFile {
  const body = renderBody(contractDef);
  const index = toc(body).content;
  const content = source`
  # Native Format Smart Player API
  > Version ${contractDef.version}

  ## Table of Contents
  ${index}

  ${body}`;

  return { filepath: 'smartplayer.md', content };
}

function renderBody(contractDef: ContractDef): string {
  return source`
  ## Plugins

  ${map(contractDef.pluginDefs, p => source`
  ### ${pascal(p.kind.split('.').pop()!)}
  > ${p.kind}

  ${p.description}

  ${isEmpty(p.configDefs) ? '' : source`
  #### Config

  ${makeArgumentsTable(p.configDefs!)}
  `}

  ${isEmpty(p.paramDefs) ? '' : source`
  #### Params

  ${makeParamsTable(p.paramDefs!)}
  `}

  ${json(exampleForPlugin(p))}
  `)}

  ## Param Kinds

  ${map(contractDef.paramKindDefs, p => source`
  ### ${pascal(p.kind)}

  ${p.description}

  #### Commands

  ${map(p.commandDefs, c => source`
  ##### ${pascal(c.name)}

  ${c.description}

  ###### Arguments

  ${makeArgumentsTable(c.argDefs || [])}

  ${json(exampleForCommand(c))}
  `)}
  `)}
  `;
}
