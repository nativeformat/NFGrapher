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
import { JSONSchema4 } from 'json-schema';
import * as path from 'path';
import { quicktype } from 'quicktype';
import { OutputFile } from '../../interfaces';

const scoreHeaderName = `Score.generated.h`;

export async function renderScore(
  schema: JSONSchema4
): Promise<OutputFile[]> {
  // Export only the score definitions.
  // Generate initial types.
  const { lines } = await quicktype({
    lang: 'c++',
    indentation: '  ',
    rendererOptions: {
      namespace: 'nfgrapher'
    },
    sources: [
      {
        name: 'score',
        // change where the schema 'starts' so we don't generate useless interfaces
        schema: JSON.stringify({
          '$ref': '#/definitions/score/definitions/Score',
          definitions: { ...schema.definitions }
        })
      }
    ]
  });
  const content = lines.join('\n').replace(`"json.hpp"`, `<nlohmann/json.hpp>`);

  const filepath = path.join('include', 'NFGrapher', scoreHeaderName);
  return [
    { filepath, content }
  ];
}

export function renderScoreImport(): string {
  return source`#include "${scoreHeaderName}"`;
}

