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
import * as path from 'path';
import { isUndefined } from 'lodash';

export function argMapperConstructorForValueKind(kind: ValueKind): string {
  switch (kind) {
    case ValueKind.String: return 'newStringArg';
    case ValueKind.ListString: return 'newStringListArg';
    case ValueKind.Int: return 'newIntArg';
    case ValueKind.ListInt: return 'newIntListArg';
    case ValueKind.Time: return 'newTimeArg';
    case ValueKind.ListTime: return 'newTimeListArg';
    case ValueKind.Bool: return 'newBoolArg';
    case ValueKind.ListBool: return 'newBoolListArg';
    case ValueKind.Float: return 'newFloatArg';
    case ValueKind.ListFloat: return 'newFloatListArg';
    default: throw new Error('unknown ValueKind');
  }
}

export function typeTokenForValueKind(kind: ValueKind): string {
  switch (kind) {
    case ValueKind.String: return 'String';
    case ValueKind.ListString: return 'List<String>';
    case ValueKind.Int: return 'Long';
    case ValueKind.ListInt: return 'List<Long>';
    case ValueKind.Time: return 'Time';
    case ValueKind.ListTime: return 'List<Time>';
    case ValueKind.Bool: return 'Boolean';
    case ValueKind.ListBool: return 'List<Boolean>';
    case ValueKind.Float: return 'Double';
    case ValueKind.ListFloat: return 'List<Double>';
    default: throw new Error('unknown ValueKind');
  }
}

export function valueTokenForValue(value: any, valueKind: ValueKind): string {
  if (isUndefined(value)) {
    return 'null';
  }

  const makeList = (v: string[]) => `Arrays.asList(${commaLists`${v}`})`;
  switch (valueKind) {
    case ValueKind.String: return `"${value}"`;
    case ValueKind.ListString: return makeList(value.map((v: any) => `"${v}"`));
    case ValueKind.Int: return `${value}L`;
    case ValueKind.ListInt: return makeList(value.map((v: any) => `${v}L`));
    case ValueKind.Time: return `Time.fromNanos(${value})`;
    case ValueKind.ListTime: return makeList(value.map((v: any) => `Time.fromNanos(${value})`));
    case ValueKind.Bool: return `${value}`;
    case ValueKind.ListBool: return makeList(value.map((v: any) => `${v}`));
    case ValueKind.Float: return `${value}D`;
    case ValueKind.ListFloat: return makeList(value.map((v: any) => `${v}D`));
    default: throw new Error('unknown ValueKind for value');
  }
}

export function pathForClass(packageName: string, className: string): string {
  return path.join(...packageName.split('.'), `${className}.java`);
}
