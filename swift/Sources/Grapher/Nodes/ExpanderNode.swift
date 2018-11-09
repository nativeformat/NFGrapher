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

/// A plugin that performs dynamic range expansion on an audio stream.
public final class ExpanderNode: Node {
    public enum DetectionMode: String, Codable {
        case max = "max"
        case rms = "rms"
    }
    public enum KneeMode: String, Codable {
        case hard = "hard"
        case soft = "soft"
    }

    private enum ConfigKeys: String, CodingKey {
        case detectionMode = "detectionMode"
        case kneeMode = "kneeMode"
        case cutoffs = "cutoffs"
    }

    private enum ParamKeys: String, CodingKey {
        case thresholdDb = "thresholdDb"
        case kneeDb = "kneeDb"
        case ratioDb = "ratioDb"
        case attack = "attack"
        case release = "release"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio, "sidechain": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
    public var detectionMode: DetectionMode

    /// The shape of the knee in the expansion function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
    public var kneeMode: KneeMode

    /// A list of cutoff frequencies in Hz for multiband expansion. If the list is empty, no band splitting will be performed.
    public var cutoffs: [Double]

    /// An audio parameter specifying the threshold (in dB) at which expansion will start.
    public var thresholdDb: AudioParam

    /// An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
    public var kneeDb: AudioParam

    /// An audio parameter specifying the amount of dB change from input to 1 dB of output.
    public var ratioDb: AudioParam

    /// An audio parameter specifying the amount time till the expander starts reducing the gain.
    public var attack: AudioParam

    /// An audio parameter specifying the amount time till the expander starts increasing the gain.
    public var release: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - detectionMode: The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
            - kneeMode: The shape of the knee in the expansion function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
            - cutoffs: A list of cutoff frequencies in Hz for multiband expansion. If the list is empty, no band splitting will be performed.
            - thresholdDb: An audio parameter specifying the threshold (in dB) at which expansion will start.
            - kneeDb: An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
            - ratioDb: An audio parameter specifying the amount of dB change from input to 1 dB of output.
            - attack: An audio parameter specifying the amount time till the expander starts reducing the gain.
            - release: An audio parameter specifying the amount time till the expander starts increasing the gain.
     */
    public init(id: String = IDGenerator.generateUniqueID(), detectionMode: DetectionMode = .max, kneeMode: KneeMode = .hard, cutoffs: [Double] = [], thresholdDb: AudioParam, kneeDb: AudioParam, ratioDb: AudioParam, attack: AudioParam, release: AudioParam) {
        self.detectionMode = detectionMode
        self.kneeMode = kneeMode
        self.cutoffs = cutoffs
        self.thresholdDb = thresholdDb
        self.kneeDb = kneeDb
        self.ratioDb = ratioDb
        self.attack = attack
        self.release = release

        super.init(id: id, kind: .expanderNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        detectionMode = try config.decodeIfPresent(DetectionMode.self, forKey: .detectionMode) ?? .max
        kneeMode = try config.decodeIfPresent(KneeMode.self, forKey: .kneeMode) ?? .hard
        cutoffs = try config.decodeIfPresent([Double].self, forKey: .cutoffs) ?? []
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        thresholdDb = try params.decode(AudioParam.self, forKey: .thresholdDb, initialValue: -24)
        kneeDb = try params.decode(AudioParam.self, forKey: .kneeDb, initialValue: 30)
        ratioDb = try params.decode(AudioParam.self, forKey: .ratioDb, initialValue: 12)
        attack = try params.decode(AudioParam.self, forKey: .attack, initialValue: 0.0003)
        release = try params.decode(AudioParam.self, forKey: .release, initialValue: 0.25)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        try config.encode(detectionMode, forKey: .detectionMode)
        try config.encode(kneeMode, forKey: .kneeMode)
        try config.encode(cutoffs, forKey: .cutoffs)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(thresholdDb, forKey: .thresholdDb)
        try params.encode(kneeDb, forKey: .kneeDb)
        try params.encode(ratioDb, forKey: .ratioDb)
        try params.encode(attack, forKey: .attack)
        try params.encode(release, forKey: .release)

        try super.encode(to: encoder)
    }
}
