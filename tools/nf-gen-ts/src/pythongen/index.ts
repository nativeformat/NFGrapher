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
import { default as renderTyped } from './renderers/Typed';
import { JSONSchema4 } from 'json-schema';

function renderInit(contractDef: ContractDef): OutputFile {
  return { filepath: '__init__.py', content: `VERSION = '${contractDef.version}'\n` };
}

const LICENSE_HEADER = `#
#  Copyright 2018 Spotify AB.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing,
#  software distributed under the License is distributed on an
#  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
#  specific language governing permissions and limitations
#  under the License.

# Generated`

export async function render(
  contractDef: ContractDef,
  scoreSchema: JSONSchema4
): Promise<OutputFile[]> {
  return [
    renderInit(contractDef),
    ...renderTyped(contractDef)
  ].map(f => ({ ...f, content: `${LICENSE_HEADER}\n\n${f.content}` }));
}
