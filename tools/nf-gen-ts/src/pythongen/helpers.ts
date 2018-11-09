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
import { ValueKind } from '../defs.generated';
import { commaLists } from 'common-tags';
import { isUndefined } from 'lodash';

export function valueTokenForValue(value: any, valueKind: ValueKind): string {
  if (isUndefined(value)) {
    return 'None';
  }

  const makeList = (v: string[]) => `[${commaLists`${v}`}]`;
  switch (valueKind) {
    case ValueKind.String: return `'${value}'`;
    case ValueKind.ListString: return makeList(value.map((v: any) => `'${v}'`));
    case ValueKind.Int: return `${value}`;
    case ValueKind.ListInt: return makeList(value.map((v: any) => `${v}`));
    case ValueKind.Time: return `${value}`;
    case ValueKind.ListTime: return makeList(value.map((v: any) => `${value}`));
    case ValueKind.Bool: return value ? 'True' : 'False';
    case ValueKind.ListBool: return makeList(value.map((v: any) => value ? 'True' : 'False'));
    case ValueKind.Float: return `${value}`;
    case ValueKind.ListFloat: return makeList(value.map((v: any) => `${v}`));
    default: throw new Error('unknown ValueKind for value');
  }
}

export function assertNameForKind(valueKind: ValueKind): string {
  switch (valueKind) {
    case ValueKind.String: return 'string';
    case ValueKind.ListString: return 'list_string';
    case ValueKind.Int: return 'int';
    case ValueKind.ListInt: return 'list_int';
    case ValueKind.Time: return 'time';
    case ValueKind.ListTime: return 'list_time';
    case ValueKind.Bool: return 'bool';
    case ValueKind.ListBool: return 'list_bool';
    case ValueKind.Float: return 'float';
    case ValueKind.ListFloat: return 'list_float';
    default: throw new Error('unknown ValueKind for value');
  }
}
