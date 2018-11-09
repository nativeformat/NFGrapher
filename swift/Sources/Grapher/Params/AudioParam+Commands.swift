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

public extension AudioParam {
    /// Command that can be applied to a AudioParam.
    public class Command: Codable {
        /**
            Enumeration of different command names.

            - setValueAtTime: Sets the value of this param at the given start time.
            - linearRampToValueAtTime: Linearly interpolates the param from its current value to the give value at the given time.
            - exponentialRampToValueAtTime: Exponentially interpolates the param from its current value to the give value at the given time.
            - setTargetAtTime: Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.
            - setValueCurveAtTime: Specifies a curve to render based on the given float values.
         */
        public enum Name: String, Codable {
            case setValueAtTime = "setValueAtTime"
            case linearRampToValueAtTime = "linearRampToValueAtTime"
            case exponentialRampToValueAtTime = "exponentialRampToValueAtTime"
            case setTargetAtTime = "setTargetAtTime"
            case setValueCurveAtTime = "setValueCurveAtTime"
        }

        internal enum CodingKeys: String, CodingKey {
            case name
            case args
        }

        /// Name of this command.
        public var name: Name

        /**
            Designated initializer

            - Parameters:
                - name: Name of this command.
         */
        public init(name: Name) {
            self.name = name
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            name = try container.decode(Name.self, forKey: .name)
        }

        public func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            try container.encode(name, forKey: .name)
        }
    }
    /// Sets the value of this param at the given start time.
    public final class SetValueAtTimeCommand: Command {
        private enum ArgKeys: String, CodingKey {
            case value = "value"
            case startTime = "startTime"
        }

        /// The desired value.
        public var value: Double

        /// The time the value should be set.
        public var startTime: Time

        /**
            Designated initializer

            - Parameters:
                - value: The desired value.
                - startTime: The time the value should be set.
         */
        public init(value: Double, startTime: Time) {
          self.value = value
          self.startTime = startTime

          super.init(name: .setValueAtTime)
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            value = try args.decode(Double.self, forKey: .value)
            startTime = try args.decode(Time.self, forKey: .startTime)
            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            try args.encode(value, forKey: .value)
            try args.encode(startTime, forKey: .startTime)
            try super.encode(to: encoder)
        }
    }
    /// Linearly interpolates the param from its current value to the give value at the given time.
    public final class LinearRampToValueAtTimeCommand: Command {
        private enum ArgKeys: String, CodingKey {
            case value = "value"
            case endTime = "endTime"
        }

        /// The desired value.
        public var value: Double

        /// The time at which this param should have the given value.
        public var endTime: Time

        /**
            Designated initializer

            - Parameters:
                - value: The desired value.
                - endTime: The time at which this param should have the given value.
         */
        public init(value: Double, endTime: Time) {
          self.value = value
          self.endTime = endTime

          super.init(name: .linearRampToValueAtTime)
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            value = try args.decode(Double.self, forKey: .value)
            endTime = try args.decode(Time.self, forKey: .endTime)
            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            try args.encode(value, forKey: .value)
            try args.encode(endTime, forKey: .endTime)
            try super.encode(to: encoder)
        }
    }
    /// Exponentially interpolates the param from its current value to the give value at the given time.
    public final class ExponentialRampToValueAtTimeCommand: Command {
        private enum ArgKeys: String, CodingKey {
            case value = "value"
            case endTime = "endTime"
        }

        /// The desired value.
        public var value: Double

        /// The time at which this param should have the given value.
        public var endTime: Time

        /**
            Designated initializer

            - Parameters:
                - value: The desired value.
                - endTime: The time at which this param should have the given value.
         */
        public init(value: Double, endTime: Time) {
          self.value = value
          self.endTime = endTime

          super.init(name: .exponentialRampToValueAtTime)
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            value = try args.decode(Double.self, forKey: .value)
            endTime = try args.decode(Time.self, forKey: .endTime)
            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            try args.encode(value, forKey: .value)
            try args.encode(endTime, forKey: .endTime)
            try super.encode(to: encoder)
        }
    }
    /// Specifies a target to reach starting at a given time and gives a constant with which to guide the curve along.
    public final class SetTargetAtTimeCommand: Command {
        private enum ArgKeys: String, CodingKey {
            case target = "target"
            case startTime = "startTime"
            case timeConstant = "timeConstant"
        }

        /// The target value to reach.
        public var target: Double

        /// The starting time.
        public var startTime: Time

        /// A constant to guide the curve.
        public var timeConstant: Double

        /**
            Designated initializer

            - Parameters:
                - target: The target value to reach.
                - startTime: The starting time.
                - timeConstant: A constant to guide the curve.
         */
        public init(target: Double, startTime: Time, timeConstant: Double) {
          self.target = target
          self.startTime = startTime
          self.timeConstant = timeConstant

          super.init(name: .setTargetAtTime)
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            target = try args.decode(Double.self, forKey: .target)
            startTime = try args.decode(Time.self, forKey: .startTime)
            timeConstant = try args.decode(Double.self, forKey: .timeConstant)
            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            try args.encode(target, forKey: .target)
            try args.encode(startTime, forKey: .startTime)
            try args.encode(timeConstant, forKey: .timeConstant)
            try super.encode(to: encoder)
        }
    }
    /// Specifies a curve to render based on the given float values.
    public final class SetValueCurveAtTimeCommand: Command {
        private enum ArgKeys: String, CodingKey {
            case values = "values"
            case startTime = "startTime"
            case duration = "duration"
        }

        /// The curve values.
        public var values: [Double]

        /// The starting time.
        public var startTime: Time

        /// The duration of the curve.
        public var duration: Time

        /**
            Designated initializer

            - Parameters:
                - values: The curve values.
                - startTime: The starting time.
                - duration: The duration of the curve.
         */
        public init(values: [Double], startTime: Time, duration: Time) {
          self.values = values
          self.startTime = startTime
          self.duration = duration

          super.init(name: .setValueCurveAtTime)
        }

        // MARK: Codable

        public required init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            let args = try container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            values = try args.decode([Double].self, forKey: .values)
            startTime = try args.decode(Time.self, forKey: .startTime)
            duration = try args.decode(Time.self, forKey: .duration)
            try super.init(from: decoder)
        }

        public override func encode(to encoder: Encoder) throws {
            var container = encoder.container(keyedBy: CodingKeys.self)
            var args = container.nestedContainer(keyedBy: ArgKeys.self, forKey: .args)
            try args.encode(values, forKey: .values)
            try args.encode(startTime, forKey: .startTime)
            try args.encode(duration, forKey: .duration)
            try super.encode(to: encoder)
        }
    }
}
