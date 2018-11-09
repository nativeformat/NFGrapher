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

/// A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and cutoff or center frequency of each section are controlled by audio parameters.
public final class Eq3bandNode: Node {
    private enum ParamKeys: String, CodingKey {
        case lowCutoff = "lowCutoff"
        case midFrequency = "midFrequency"
        case highCutoff = "highCutoff"
        case lowGain = "lowGain"
        case midGain = "midGain"
        case highGain = "highGain"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// An audio parameter specifying the cutoff frequency (Hz) for the low shelf filter, below which the lowGain will be applied.
    public var lowCutoff: AudioParam

    /// An audio parameter specifying the center frequency (Hz) of the peq filter, at which midGain will be applied.
    public var midFrequency: AudioParam

    /// An audio parameter specifying the cutoff frequency for the high shelf filter, above which the highGain will be applied.
    public var highCutoff: AudioParam

    /// An audio parameter specifying the gain (dB) for the low shelf.
    public var lowGain: AudioParam

    /// An audio parameter specifying the gain (dB) for the mid range filter.
    public var midGain: AudioParam

    /// An audio parameter specifying the gain (dB) for the high shelf.
    public var highGain: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - lowCutoff: An audio parameter specifying the cutoff frequency (Hz) for the low shelf filter, below which the lowGain will be applied.
            - midFrequency: An audio parameter specifying the center frequency (Hz) of the peq filter, at which midGain will be applied.
            - highCutoff: An audio parameter specifying the cutoff frequency for the high shelf filter, above which the highGain will be applied.
            - lowGain: An audio parameter specifying the gain (dB) for the low shelf.
            - midGain: An audio parameter specifying the gain (dB) for the mid range filter.
            - highGain: An audio parameter specifying the gain (dB) for the high shelf.
     */
    public init(id: String = IDGenerator.generateUniqueID(), lowCutoff: AudioParam, midFrequency: AudioParam, highCutoff: AudioParam, lowGain: AudioParam, midGain: AudioParam, highGain: AudioParam) {
        self.lowCutoff = lowCutoff
        self.midFrequency = midFrequency
        self.highCutoff = highCutoff
        self.lowGain = lowGain
        self.midGain = midGain
        self.highGain = highGain

        super.init(id: id, kind: .eq3bandNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        lowCutoff = try params.decode(AudioParam.self, forKey: .lowCutoff, initialValue: 264)
        midFrequency = try params.decode(AudioParam.self, forKey: .midFrequency, initialValue: 1000)
        highCutoff = try params.decode(AudioParam.self, forKey: .highCutoff, initialValue: 3300)
        lowGain = try params.decode(AudioParam.self, forKey: .lowGain, initialValue: 0)
        midGain = try params.decode(AudioParam.self, forKey: .midGain, initialValue: 0)
        highGain = try params.decode(AudioParam.self, forKey: .highGain, initialValue: 0)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(lowCutoff, forKey: .lowCutoff)
        try params.encode(midFrequency, forKey: .midFrequency)
        try params.encode(highCutoff, forKey: .highCutoff)
        try params.encode(lowGain, forKey: .lowGain)
        try params.encode(midGain, forKey: .midGain)
        try params.encode(highGain, forKey: .highGain)

        try super.encode(to: encoder)
    }
}
