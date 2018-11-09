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
import { ParamKindDef, ContractDef, ValueKind, ArgDef } from './defs.generated';
import { createNone, createSome, Option } from 'option-t';
import { createErr, createOk, Result } from 'option-t/cjs/Result';
import { isArray, isBoolean, isInteger, isNumber, isString, isUndefined, map, reduce } from 'lodash';

function findDuplicate<T>(list: T[]): Option<T> {
  const unique = new Set();
  for (const item of list) {
    if (unique.has(item)) {
      return createSome(item);
    } else {
      unique.add(item);
    }
  }
  return createNone();
}

function valueIsOfKind(value: any, kind: ValueKind): boolean {
  switch (kind) {
    case ValueKind.Bool: return isBoolean(value);
    case ValueKind.Float: return isNumber(value);
    case ValueKind.Int: return isInteger(value);
    case ValueKind.String: return isString(value);
    case ValueKind.Time: return isInteger(value);

    case ValueKind.ListBool: return isArray(value) && value.every(isBoolean);
    case ValueKind.ListFloat: return isArray(value) && value.every(isNumber);
    case ValueKind.ListInt: return isArray(value) && value.every(isInteger);
    case ValueKind.ListString: return isArray(value) && value.every(isString);
    case ValueKind.ListTime: return isArray(value) && value.every(isInteger);

    default: throw new Error(`unknown ValueKind=${kind}`);
  }
}

interface ParamKindDefMap { [kind: string]: ParamKindDef; }

function validateArgDef(def: ArgDef, isConfig: boolean = false) {
  const argDefType = isConfig ? 'config' : 'argument';

  if (def.defaultValue !== undefined
    && !valueIsOfKind(def.defaultValue, def.kind)) {
    throw new Error(`mismatched defaultValue kind for ${argDefType} with name=${def.name}`);
  }

  if (!isUndefined(def.possibleValues) && def.kind !== ValueKind.String) {
    throw new Error(`expected ${argDefType} with 'possibleValues' to be a 'string' kind`);
  }
}

function validateWithErrors({ paramKindDefs = [], pluginDefs = []}: ContractDef) {
  // no duplicate param kinds
  findDuplicate(map(paramKindDefs, 'kind'))
    .map(dupe => { throw new Error(`duplicate ParamKind with kind=${dupe}`); });

  for (const paramKindDef of paramKindDefs) {
    const { commandDefs = [] } = paramKindDef;

    // no duplicate command names
    findDuplicate(map(commandDefs, 'name'))
      .map(dupe => { throw new Error(`duplicate Command with name=${dupe}`); });

    for (const commandDef of commandDefs) {
      const { argDefs = [] } = commandDef;

      // no duplicate arg names.
      findDuplicate(map(argDefs, 'name'))
        .map(dupe => { throw new Error(`duplicate command argument with name=${dupe}`); });

      // valid defaults
      for (const argDef of argDefs) {
        validateArgDef(argDef);
      }
    }
  }

  // no duplicate plugin kinds
  findDuplicate(map(pluginDefs, 'kind'))
    .map(dupe => { throw new Error(`duplicate Plugin with kind=${dupe}`); });

  const paramKindDefMap: ParamKindDefMap = reduce(
    paramKindDefs,
    (accum: ParamKindDefMap, paramKindDef) => {
      accum[paramKindDef.kind] = paramKindDef;
      return accum;
    },
    {}
  );

  for (const pluginDef of pluginDefs) {
    const { paramDefs = [], configDefs = []} = pluginDef;

    // no duplicate param/config names
    findDuplicate(map([...paramDefs, ...configDefs], 'name'))
      .map(dupe => { throw new Error(`duplicate param or config with name=${dupe}`); });

    // valid defaults
    for (const configDef of configDefs) {
      validateArgDef(configDef, true);
    }

    for (const paramDef of paramDefs) {
      const maybeDef = paramKindDefMap[paramDef.kind];
      if (maybeDef === undefined) {
        throw new Error(`undefined param kind=${paramDef.kind}`);
      }

      // type check initial value
      if (!valueIsOfKind(paramDef.initialValue, maybeDef.valueKind)) {
        throw new Error(`mismatched initialValue kind for param with name=${paramDef.name}`);
      }
    }
  }
}

export function validate(contractDef: ContractDef): Result<void, Error> {
  try {
    validateWithErrors(contractDef);
    return createOk<void, Error>(undefined);
  } catch(error) {
    return createErr<void, Error>(error);
  }
}

