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

/// A plugin that manipulates the volume of an audio stream.
public final class GainNode: Node {
    private enum ParamKeys: String, CodingKey {
        case gain = "gain"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// An audio parameter specifying the amplitude multiplier for the input signal.
    public var gain: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - gain: An audio parameter specifying the amplitude multiplier for the input signal.
     */
    public init(id: String = IDGenerator.generateUniqueID(), gain: AudioParam) {
        self.gain = gain

        super.init(id: id, kind: .gainNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        gain = try params.decode(AudioParam.self, forKey: .gain, initialValue: 1)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(gain, forKey: .gain)

        try super.encode(to: encoder)
    }
}
