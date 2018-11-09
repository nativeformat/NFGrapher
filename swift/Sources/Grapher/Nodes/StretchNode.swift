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

/// A plugin that can independently stretch time and shift the pitch of an audio stream.
public final class StretchNode: Node {
    private enum ParamKeys: String, CodingKey {
        case pitchRatio = "pitchRatio"
        case stretch = "stretch"
        case formantRatio = "formantRatio"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// An audio parameter specifying the pitch multiplier. For example, a pitchRatio value of 2.0 will double the original audio frequencies. 
    public var pitchRatio: AudioParam

    /// An audio parameter specifying the time stretch multiplier. For example, a stretch value of 2.0 will make audio play at half the original speed.
    public var stretch: AudioParam

    /// An audio parameter specifying the formant envelope multiplier. If the formantRatio is equal to the pitchRatio, formant-preserving pitch shifting will be performed.
    public var formantRatio: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - pitchRatio: An audio parameter specifying the pitch multiplier. For example, a pitchRatio value of 2.0 will double the original audio frequencies. 
            - stretch: An audio parameter specifying the time stretch multiplier. For example, a stretch value of 2.0 will make audio play at half the original speed.
            - formantRatio: An audio parameter specifying the formant envelope multiplier. If the formantRatio is equal to the pitchRatio, formant-preserving pitch shifting will be performed.
     */
    public init(id: String = IDGenerator.generateUniqueID(), pitchRatio: AudioParam, stretch: AudioParam, formantRatio: AudioParam) {
        self.pitchRatio = pitchRatio
        self.stretch = stretch
        self.formantRatio = formantRatio

        super.init(id: id, kind: .stretchNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        pitchRatio = try params.decode(AudioParam.self, forKey: .pitchRatio, initialValue: 1)
        stretch = try params.decode(AudioParam.self, forKey: .stretch, initialValue: 1)
        formantRatio = try params.decode(AudioParam.self, forKey: .formantRatio, initialValue: 1)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(pitchRatio, forKey: .pitchRatio)
        try params.encode(stretch, forKey: .stretch)
        try params.encode(formantRatio, forKey: .formantRatio)

        try super.encode(to: encoder)
    }
}
