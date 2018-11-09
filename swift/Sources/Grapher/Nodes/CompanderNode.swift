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

/// A plugin that performs dynamic range compansion (compression + expansion) on an audio stream.
public final class CompanderNode: Node {
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
        case compressorThresholdDb = "compressorThresholdDb"
        case compressorKneeDb = "compressorKneeDb"
        case compressorRatioDb = "compressorRatioDb"
        case expanderThresholdDb = "expanderThresholdDb"
        case expanderKneeDb = "expanderKneeDb"
        case expanderRatioDb = "expanderRatioDb"
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

    /// The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
    public var kneeMode: KneeMode

    /// A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.
    public var cutoffs: [Double]

    /// An audio parameter specifying the threshold (in dB) at which compression will start.
    public var compressorThresholdDb: AudioParam

    /// An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion.
    public var compressorKneeDb: AudioParam

    /// An audio parameter specifying the amount of dB change from input to 1 dB of output in the compressor.
    public var compressorRatioDb: AudioParam

    /// An audio parameter specifying the threshold (in dB) at which expansion will start.
    public var expanderThresholdDb: AudioParam

    /// An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
    public var expanderKneeDb: AudioParam

    /// An audio parameter specifying the amount of dB change from input to 1 dB of output in the expander.
    public var expanderRatioDb: AudioParam

    /// An audio parameter specifying the amount time till the compander starts reducing the gain.
    public var attack: AudioParam

    /// An audio parameter specifying the amount time till the compander starts increasing the gain.
    public var release: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - detectionMode: The signal level detection algorithm to use. Possible values are 'max' and 'rms' (root mean square). This configuration is case-sensitive. Any specified configuration not matching 'max' or 'rms' will be automatically set to 'max'.
            - kneeMode: The shape of the knee in the compression function. Possible values are hard and soft. This configuration is case-sensitive. Any specified configuration not matching 'hard' or 'soft' will be automatically set to 'hard'.
            - cutoffs: A list of cutoff frequencies in Hz for multiband compression. If the list is empty, no band splitting will be performed.
            - compressorThresholdDb: An audio parameter specifying the threshold (in dB) at which compression will start.
            - compressorKneeDb: An audio parameter specifying the range (in dB) above the threshold at which point the compression curve transitions to the ratio portion.
            - compressorRatioDb: An audio parameter specifying the amount of dB change from input to 1 dB of output in the compressor.
            - expanderThresholdDb: An audio parameter specifying the threshold (in dB) at which expansion will start.
            - expanderKneeDb: An audio parameter specifying the range (in dB) above the threshold at which point the expansion curve transitions to the ratio portion.
            - expanderRatioDb: An audio parameter specifying the amount of dB change from input to 1 dB of output in the expander.
            - attack: An audio parameter specifying the amount time till the compander starts reducing the gain.
            - release: An audio parameter specifying the amount time till the compander starts increasing the gain.
     */
    public init(id: String = IDGenerator.generateUniqueID(), detectionMode: DetectionMode = .max, kneeMode: KneeMode = .hard, cutoffs: [Double] = [], compressorThresholdDb: AudioParam, compressorKneeDb: AudioParam, compressorRatioDb: AudioParam, expanderThresholdDb: AudioParam, expanderKneeDb: AudioParam, expanderRatioDb: AudioParam, attack: AudioParam, release: AudioParam) {
        self.detectionMode = detectionMode
        self.kneeMode = kneeMode
        self.cutoffs = cutoffs
        self.compressorThresholdDb = compressorThresholdDb
        self.compressorKneeDb = compressorKneeDb
        self.compressorRatioDb = compressorRatioDb
        self.expanderThresholdDb = expanderThresholdDb
        self.expanderKneeDb = expanderKneeDb
        self.expanderRatioDb = expanderRatioDb
        self.attack = attack
        self.release = release

        super.init(id: id, kind: .companderNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        detectionMode = try config.decodeIfPresent(DetectionMode.self, forKey: .detectionMode) ?? .max
        kneeMode = try config.decodeIfPresent(KneeMode.self, forKey: .kneeMode) ?? .hard
        cutoffs = try config.decodeIfPresent([Double].self, forKey: .cutoffs) ?? []
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        compressorThresholdDb = try params.decode(AudioParam.self, forKey: .compressorThresholdDb, initialValue: -24)
        compressorKneeDb = try params.decode(AudioParam.self, forKey: .compressorKneeDb, initialValue: 30)
        compressorRatioDb = try params.decode(AudioParam.self, forKey: .compressorRatioDb, initialValue: 12)
        expanderThresholdDb = try params.decode(AudioParam.self, forKey: .expanderThresholdDb, initialValue: -24)
        expanderKneeDb = try params.decode(AudioParam.self, forKey: .expanderKneeDb, initialValue: 30)
        expanderRatioDb = try params.decode(AudioParam.self, forKey: .expanderRatioDb, initialValue: 12)
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
        try params.encode(compressorThresholdDb, forKey: .compressorThresholdDb)
        try params.encode(compressorKneeDb, forKey: .compressorKneeDb)
        try params.encode(compressorRatioDb, forKey: .compressorRatioDb)
        try params.encode(expanderThresholdDb, forKey: .expanderThresholdDb)
        try params.encode(expanderKneeDb, forKey: .expanderKneeDb)
        try params.encode(expanderRatioDb, forKey: .expanderRatioDb)
        try params.encode(attack, forKey: .attack)
        try params.encode(release, forKey: .release)

        try super.encode(to: encoder)
    }
}
