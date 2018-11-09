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

// prettier-ignore
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

// prettier-ignore
export function typeTokenForValueKind(kind?: ValueKind): string {
  switch (kind) {
    case ValueKind.String: return 'string';
    case ValueKind.ListString: return 'string[]';
    case ValueKind.Int: return 'number';
    case ValueKind.ListInt: return 'number[]';
    case ValueKind.Time: return 'number';
    case ValueKind.ListTime: return 'number[]';
    case ValueKind.Bool: return 'boolean';
    case ValueKind.ListBool: return 'boolean[]';
    case ValueKind.Float: return 'number';
    case ValueKind.ListFloat: return 'number[]';
    default: throw new Error('unknown ValueKind');
  }
}

export function valueTokenForValue(value: any): string {
  return JSON.stringify(value);
}
