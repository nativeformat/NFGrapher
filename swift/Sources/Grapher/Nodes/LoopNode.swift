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

/// A plugin that loops an audio stream.
public final class LoopNode: Node {

    private enum ConfigKeys: String, CodingKey {
        case when = "when"
        case duration = "duration"
        case loopCount = "loopCount"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// Describes when the plugin should begin looping.
    public var when: Time

    /// Describes the duration of the loop.
    public var duration: Time

    /// Describes the total number of loops. -1 loops infinitely.
    public var loopCount: Int

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - when: Describes when the plugin should begin looping.
            - duration: Describes the duration of the loop.
            - loopCount: Describes the total number of loops. -1 loops infinitely.
     */
    public init(id: String = IDGenerator.generateUniqueID(), when: Time, duration: Time, loopCount: Int = -1) {
        self.when = when
        self.duration = duration
        self.loopCount = loopCount

        super.init(id: id, kind: .loopNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        when = try config.decode(Time.self, forKey: .when)
        duration = try config.decode(Time.self, forKey: .duration)
        loopCount = try config.decodeIfPresent(Int.self, forKey: .loopCount) ?? -1

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        try config.encode(when, forKey: .when)
        try config.encode(duration, forKey: .duration)
        try config.encode(loopCount, forKey: .loopCount)

        try super.encode(to: encoder)
    }
}
