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
import {
  ArgDef,
  Command,
  CommandDef,
  Node,
  ParamDef,
  PluginDef,
  ValueKind
} from '../defs.generated';
import { typeTokenForValueKind, valueTokenForValue } from '../tsgen/helpers';
import { reduce } from 'lodash';

export function code(str: string): string {
  return '`' + str + '`';
}

export function json(thing: any): string {
  return '```json\n' + JSON.stringify(thing, null, 2) + '\n```';
}

export function makeTable(header: string[], rows: string[][]): string {
  const sep = Array(header.length).fill('---');
  return [header, sep, ...rows].map(row => row.join(' | ')).join('\n');
}

export function makeArgumentsTable(argDefs: ArgDef[]): string {
  const rows = argDefs.map(a => [
    a.name,
    typeTokenForValueKind(a.kind),
    a.defaultValue !== undefined ? code(valueTokenForValue(a.defaultValue)) : '-',
    a.description || '',
  ]);

  return makeTable(['Name', 'Type', 'Default Value', 'Description'], rows);
}

export function makeParamsTable(paramDefs: ParamDef[]): string {
  const rows = paramDefs.map(a => [
    a.name,
    a.kind,
    code(valueTokenForValue(a.initialValue)),
    a.description || '',
  ]);

  return makeTable(['Name', 'Type', 'Initial Value', 'Description'], rows);
}

export function exampleForKind(kind: ValueKind): any {
  switch (kind) {
    case ValueKind.String: return 'a string';
    case ValueKind.ListString: return ['a', 'string'];
    case ValueKind.Int: return 42;
    case ValueKind.ListInt: return [4, 2];
    case ValueKind.Time: return 1000;
    case ValueKind.ListTime: return [ 10, 200 ];
    case ValueKind.Bool: return true;
    case ValueKind.ListBool: return [ true, false ];
    case ValueKind.Float: return 1.234;
    case ValueKind.ListFloat: return [1.234, 2.42, 3.14];
    default: throw Error('unknown value kind');
  }
}

export function exampleForCommand(commandDef: CommandDef): Command {
  return {
    name: commandDef.name,
    args: reduce(
      commandDef.argDefs,
      (accum, a) => ({ ...accum, [a.name]: exampleForKind(a.kind) }),
      {}
    ),
  };
}

export function exampleForPlugin(pluginDef: PluginDef): Node {
  return {
    id: 'f6e4bf13-3db2-4c76-b42b-1e5e5b4d6eb5',
    kind: pluginDef.kind,
    config: reduce(
      pluginDef.configDefs,
      (accum, c) => ({ ...accum, [c.name]: exampleForKind(c.kind) }),
      {}
    ),
    params: reduce(
      pluginDef.paramDefs,
      (accum, p) => ({ ...accum, [p.name]: [] }),
      {}
    ),
  };
}
