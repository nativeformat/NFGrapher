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

/* Generated */

import { Command } from '../../score';
import ParamMapper from '../../schema/ParamMapper';
import TypedParam from './TypedParam';

/**
 * AudioParam.
 */
class AudioParam extends TypedParam<number> {
  /**
   * Creates a new `AudioParam` instance.
   */
  constructor(initialValue: number, private commands: Command[] = []) {
    super(initialValue);
  }

  /**
   * Creates a new AudioParam mapper.
   */
  public static newParamMapper(
    name: string,
    initialValue: number
  ): ParamMapper<AudioParam> {
    return new ParamMapper<AudioParam>(
      name,
      cmds => new AudioParam(initialValue, [...cmds])
    );
  }

  /**
   * Sets the value of this param at the given start time.
   */
  public setValueAtTime(value: number, startTime: number): AudioParam {
    this.commands.push({
      name: 'setValueAtTime',
      args: { value, startTime }
    });
    return this;
  }

  /**
   * Linearly interpolates the param from its current value to the give value at the given time.
   */
  public linearRampToValueAtTime(value: number, endTime: number): AudioParam {
    this.commands.push({
      name: 'linearRampToValueAtTime',
      args: { value, endTime }
    });
    return this;
  }

  /**
   * Exponentially interpolates the param from its current value to the give value at the given time.
   */
  public exponentialRampToValueAtTime(
    value: number,
    endTime: number
  ): AudioParam {
    this.commands.push({
      name: 'exponentialRampToValueAtTime',
      args: { value, endTime }
    });
    return this;
  }

  /**
   * Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.
   */
  public setTargetAtTime(
    target: number,
    startTime: number,
    timeConstant: number
  ): AudioParam {
    this.commands.push({
      name: 'setTargetAtTime',
      args: { target, startTime, timeConstant }
    });
    return this;
  }

  /**
   * Specifies a curve to render based on the given float values.
   */
  public setValueCurveAtTime(
    values: number[],
    startTime: number,
    duration: number
  ): AudioParam {
    this.commands.push({
      name: 'setValueCurveAtTime',
      args: { values, startTime, duration }
    });
    return this;
  }

  /**
   * Returns an array of all commands added to this param.
   */
  public getCommands(): Command[] {
    return [...this.commands];
  }
}

/**
 * Export.
 */
export default AudioParam;
