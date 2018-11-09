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

/// A filter that attenuates low and/or high frequencies
public final class FilterNode: Node {
    public enum FilterType: String, Codable {
        case lowPass = "lowPass"
        case highPass = "highPass"
        case bandPass = "bandPass"
    }

    private enum ConfigKeys: String, CodingKey {
        case filterType = "filterType"
    }

    private enum ParamKeys: String, CodingKey {
        case lowCutoff = "lowCutoff"
        case highCutoff = "highCutoff"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// The type of filter to create. A lowPass filter attenuates frequencies above highCutoff. A highPass filter attenuates frequencies below lowCutoff. A bandPass filter does both.
    public var filterType: FilterType

    /// An audio parameter specifying the low cutoff frequency (Hz). Only used for high-pass and band-pass filters.
    public var lowCutoff: AudioParam

    /// An audio parameter specifying the high cutoff frequency (Hz). Only used for low-pass and band-pass filters.
    public var highCutoff: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - filterType: The type of filter to create. A lowPass filter attenuates frequencies above highCutoff. A highPass filter attenuates frequencies below lowCutoff. A bandPass filter does both.
            - lowCutoff: An audio parameter specifying the low cutoff frequency (Hz). Only used for high-pass and band-pass filters.
            - highCutoff: An audio parameter specifying the high cutoff frequency (Hz). Only used for low-pass and band-pass filters.
     */
    public init(id: String = IDGenerator.generateUniqueID(), filterType: FilterType = .bandPass, lowCutoff: AudioParam, highCutoff: AudioParam) {
        self.filterType = filterType
        self.lowCutoff = lowCutoff
        self.highCutoff = highCutoff

        super.init(id: id, kind: .filterNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        filterType = try config.decodeIfPresent(FilterType.self, forKey: .filterType) ?? .bandPass
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        lowCutoff = try params.decode(AudioParam.self, forKey: .lowCutoff, initialValue: 0)
        highCutoff = try params.decode(AudioParam.self, forKey: .highCutoff, initialValue: 22050)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        try config.encode(filterType, forKey: .filterType)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(lowCutoff, forKey: .lowCutoff)
        try params.encode(highCutoff, forKey: .highCutoff)

        try super.encode(to: encoder)
    }
}
