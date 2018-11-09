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

/// A plugin that controls delay time.
public final class DelayNode: Node {
    private enum ParamKeys: String, CodingKey {
        case delayTime = "delayTime"
    }

    public override class var inputs: [String: ContentType] {
        return ["audio": .audio]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// An audio parameter controlling the current delay time on the node.
    public var delayTime: AudioParam

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - delayTime: An audio parameter controlling the current delay time on the node.
     */
    public init(id: String = IDGenerator.generateUniqueID(), delayTime: AudioParam) {
        self.delayTime = delayTime

        super.init(id: id, kind: .delayNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let params = try container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        delayTime = try params.decode(AudioParam.self, forKey: .delayTime, initialValue: 0)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var params = container.nestedContainer(keyedBy: ParamKeys.self, forKey: .params)
        try params.encode(delayTime, forKey: .delayTime)

        try super.encode(to: encoder)
    }
}
