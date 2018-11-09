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
import * as Case from 'case';
import { commaLists } from 'common-tags';
import { isInteger, isUndefined } from 'lodash';
import { ValueKind } from '../defs.generated';


export function quote(value: string): string {
  return `"${value}"`;
}

export function double(value: number): string {
  if (isInteger(value)) {
    return `${value}.0`;
  } else {
    return `${value}`;
  }
}

export function typeTokenForValueKind(kind: ValueKind): string {
  switch (kind) {
    case ValueKind.String: return 'std::string';
    case ValueKind.ListString: return 'std::vector<std::string>';
    case ValueKind.Int:
    case ValueKind.Time:
      return 'long';
    case ValueKind.ListInt:
    case ValueKind.ListTime:
      return 'std::vector<long>';
    case ValueKind.Bool: return 'bool';
    case ValueKind.ListBool: return 'std::vector<bool>';
    case ValueKind.Float: return 'double';
    case ValueKind.ListFloat: return 'std::vector<double>';
    default: throw new Error('unknown ValueKind');
  }
}

export function valueTokenForValue(value: any, valueKind: ValueKind): string {
  if (isUndefined(value)) {
    return 'null';
  }

  const makeList = (v: string[]) => `{ ${commaLists`${v}`} }`;
  switch (valueKind) {
    case ValueKind.String: return quote(value);
    case ValueKind.ListString: return makeList(value.map(quote));
    case ValueKind.Int:
    case ValueKind.Time:
      return `${value}L`;
    case ValueKind.ListInt:
    case ValueKind.ListTime:
      return makeList(value.map((v: any) => `${v}L`));
    case ValueKind.Bool: return `${value}`;
    case ValueKind.ListBool: return makeList(value.map((v: any) => `${v}`));
    case ValueKind.Float: return double(value);
    case ValueKind.ListFloat: return makeList(value.map(double));
    default: throw new Error('unknown ValueKind for value');
  }
}

export function nodeNameFromKind(kind: string): string {
  return kind.split('.').pop() || '';
}

export function nodeClassFromKind(kind: string): string {
  return `${Case.pascal(nodeNameFromKind(kind))}NodeInfo`;
}

export function paramClassFromKind(kind: string): string {
  return `${Case.pascal(kind)}ParamInfo`;
}

export function commandClassFromName(name: string): string {
  return `${Case.pascal(name)}Command`;
}

export function cppMemberFromName(name: string): string {
  return `_${Case.snake(name)}`;
}

export function mapNameFromName(name: string): string {
  return `${Case.camel(name)}Map()`;
}

export function contentTypeFromKind(kind: string): string {
  return Case.camel(nodeNameFromKind(kind));
}
