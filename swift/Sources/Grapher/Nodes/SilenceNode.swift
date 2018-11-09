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

/// A plugin that outputs silence.
public final class SilenceNode: Node {

    private enum ConfigKeys: String, CodingKey {
        case when = "when"
        case duration = "duration"
    }

    public override class var inputs: [String: ContentType] {
        return [:]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// Tells the plugin when to start producing silence.
    public var when: Time

    /// Tells the plugin for how long to produce silence.
    public var duration: Time

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - when: Tells the plugin when to start producing silence.
            - duration: Tells the plugin for how long to produce silence.
     */
    public init(id: String = IDGenerator.generateUniqueID(), when: Time = Time(nanos: 0), duration: Time = Time(nanos: 0)) {
        self.when = when
        self.duration = duration

        super.init(id: id, kind: .silenceNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        when = try config.decodeIfPresent(Time.self, forKey: .when) ?? Time(nanos: 0)
        duration = try config.decodeIfPresent(Time.self, forKey: .duration) ?? Time(nanos: 0)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        try config.encode(when, forKey: .when)
        try config.encode(duration, forKey: .duration)

        try super.encode(to: encoder)
    }
}
