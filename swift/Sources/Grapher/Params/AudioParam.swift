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
// under the License

/* Generated */

import Foundation

/// A float value that can change over time.
public final class AudioParam: Param {
    private enum CommandNameKey: String, CodingKey {
        case name
    }

    /// Initial value of this param.
    public var initialValue: Double = 0

    /// List of commands to apply to this param.
    public var commands: [Command]

    /**
        Designated initializer

        - Parameters:
            - commands: List of commands to apply to this param.
     */
    public init(commands: [Command] = []) {
        self.commands = commands
    }

    /**
        Sets the value of this param at the given start time.

        - Parameters:
            - value: The desired value.
            - startTime: The time the value should be set.
     */
    public func setValueAtTime(value: Double, startTime: Time) {
        commands.append(SetValueAtTimeCommand(value: value, startTime: startTime))
    }
    /**
        Linearly interpolates the param from its current value to the give value at the given time.

        - Parameters:
            - value: The desired value.
            - endTime: The time at which this param should have the given value.
     */
    public func linearRampToValueAtTime(value: Double, endTime: Time) {
        commands.append(LinearRampToValueAtTimeCommand(value: value, endTime: endTime))
    }
    /**
        Exponentially interpolates the param from its current value to the give value at the given time.

        - Parameters:
            - value: The desired value.
            - endTime: The time at which this param should have the given value.
     */
    public func exponentialRampToValueAtTime(value: Double, endTime: Time) {
        commands.append(ExponentialRampToValueAtTimeCommand(value: value, endTime: endTime))
    }
    /**
        Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.

        - Parameters:
            - target: The target value to reach.
            - startTime: The starting time.
            - timeConstant: A constant to guide the curve.
     */
    public func setTargetAtTime(target: Double, startTime: Time, timeConstant: Double) {
        commands.append(SetTargetAtTimeCommand(target: target, startTime: startTime, timeConstant: timeConstant))
    }
    /**
        Specifies a curve to render based on the given float values.

        - Parameters:
            - values: The curve values.
            - startTime: The starting time.
            - duration: The duration of the curve.
     */
    public func setValueCurveAtTime(values: [Double], startTime: Time, duration: Time) {
        commands.append(SetValueCurveAtTimeCommand(values: values, startTime: startTime, duration: duration))
    }

    // MARK: Codable

    public init(from decoder: Decoder) throws {
        var commandsContainerForName = try decoder.unkeyedContainer()
        var commandsContainer = commandsContainerForName

        var commands: [Command] = []

        while !commandsContainerForName.isAtEnd {
            let command = try commandsContainerForName.nestedContainer(keyedBy: CommandNameKey.self)
            let commandName = try command.decode(Command.Name.self, forKey: .name)

            switch commandName {
              case .setValueAtTime:
                  commands.append(try commandsContainer.decode(SetValueAtTimeCommand.self))
              case .linearRampToValueAtTime:
                  commands.append(try commandsContainer.decode(LinearRampToValueAtTimeCommand.self))
              case .exponentialRampToValueAtTime:
                  commands.append(try commandsContainer.decode(ExponentialRampToValueAtTimeCommand.self))
              case .setTargetAtTime:
                  commands.append(try commandsContainer.decode(SetTargetAtTimeCommand.self))
              case .setValueCurveAtTime:
                  commands.append(try commandsContainer.decode(SetValueCurveAtTimeCommand.self))
            }
        }

        self.commands = commands
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(commands)
    }
}

extension KeyedDecodingContainer {
    func decode<T>(_ type: T.Type, forKey key: K, initialValue: Double) throws -> T where T: AudioParam {
        let param = try decodeIfPresent(type, forKey: key) ?? T()
        param.initialValue = initialValue
        return param
    }
}
