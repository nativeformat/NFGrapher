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
  isArray,
  isNumber,
  isBoolean,
  isInteger,
  isUndefined,
  isString
} from '../utils';
import { Command, Node } from '../score';

export default class ArgMapper<T> {
  constructor(
    public readonly name: string,
    public readonly kind: string,
    public readonly defaultValue: T | undefined,
    public readonly kindChecker: (json: any) => boolean
  ) {}

  public static newEnumArg<Enum>(
    name: string,
    defaultValue: Enum,
    possibleValues: string[]
  ): ArgMapper<Enum> {
    const checker = (maybeValue: any) => {
      if (!possibleValues.includes(maybeValue)) {
        throw new Error(
          `arg=${name} expects value=${possibleValues.join(
            '|'
          )} but value is=${maybeValue}`
        );
      }
      return true;
    };
    return new ArgMapper<Enum>(name, 'string', defaultValue, checker);
  }

  public static newStringArg(
    name: string,
    defaultValue?: string
  ): ArgMapper<string> {
    return new ArgMapper<string>(name, 'string', defaultValue, isString);
  }

  public static newIntArg(
    name: string,
    defaultValue?: number
  ): ArgMapper<number> {
    if (!isUndefined(defaultValue) && !isInteger(defaultValue)) {
      throw new Error('expected defaultValue to be an integer');
    }
    return new ArgMapper<number>(name, 'int', defaultValue, isInteger);
  }

  public static newFloatArg(
    name: string,
    defaultValue?: number
  ): ArgMapper<number> {
    return new ArgMapper<number>(name, 'float', defaultValue, isNumber);
  }

  public static newBoolArg(
    name: string,
    defaultValue?: boolean
  ): ArgMapper<boolean> {
    return new ArgMapper<boolean>(name, 'bool', defaultValue, isBoolean);
  }

  public static newTimeArg(
    name: string,
    defaultValue?: number
  ): ArgMapper<number> {
    if (!isUndefined(defaultValue) && !isInteger(defaultValue)) {
      throw new Error('expected defaultValue to be an integer');
    }
    return new ArgMapper<number>(name, 'time', defaultValue, isInteger);
  }

  public static newStringListArg(
    name: string,
    defaultValue?: string[]
  ): ArgMapper<string[]> {
    return this.newListArg(name, 'list(string)', defaultValue, isString);
  }

  public static newIntListArg(
    name: string,
    defaultValue?: number[]
  ): ArgMapper<number[]> {
    if (!isUndefined(defaultValue) && !defaultValue!.every(isInteger)) {
      throw new Error('expected defaultValue to be an integer array');
    }
    return this.newListArg(name, 'list(int)', defaultValue, isInteger);
  }

  public static newFloatListArg(
    name: string,
    defaultValue?: number[]
  ): ArgMapper<number[]> {
    return this.newListArg(name, 'list(float)', defaultValue, isNumber);
  }

  public static newBoolListArg(
    name: string,
    defaultValue?: boolean[]
  ): ArgMapper<boolean[]> {
    return this.newListArg(name, 'list(bool)', defaultValue, isBoolean);
  }

  public static newTimeListArg(
    name: string,
    defaultValue?: number[]
  ): ArgMapper<number[]> {
    if (!isUndefined(defaultValue) && !defaultValue!.every(isInteger)) {
      throw new Error('expected defaultValue to be an integer array');
    }
    return this.newListArg(name, 'list(time)', defaultValue, isInteger);
  }

  private static newListArg<T>(
    name: string,
    kind: string,
    defaultValue: T[] | undefined,
    kindChecker: (json: any) => boolean
  ): ArgMapper<T[]> {
    return new ArgMapper<T[]>(
      name,
      kind,
      defaultValue,
      n => isArray(n) && n.every(kindChecker)
    );
  }

  public getValueOrThrow(value: T | undefined, msg?: string): T {
    if (value === undefined && this.defaultValue !== undefined) {
      return this.defaultValue;
    } else if (value !== undefined) {
      return value;
    } else {
      throw new Error(msg || `expected '${this.name}'`);
    }
  }

  public readConfig(node: Node): T {
    return this.readValue((node.config || {})[this.name]);
  }

  public readArg(command: Command): T {
    return this.readValue((command.args || {})[this.name]);
  }

  private readValue(maybeValue: any | undefined): T {
    if (maybeValue === undefined && this.defaultValue !== undefined) {
      return this.defaultValue;
    } else if (maybeValue === undefined) {
      throw new Error(
        'arg=' + this.name + ' is not set and has no default value'
      );
    }

    if (!this.kindChecker(maybeValue)) {
      throw new Error(
        `arg=${this.name} expects kind=${
          this.kind
        } but value is kind=${typeof maybeValue}`
      );
    }

    return maybeValue as T;
  }
}
