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

import Foundation

/// A graph and version
public class Score: Codable {
    public enum Errors: Error {
        case invalidVersion
    }

    private enum CodingKeys: String, CodingKey {
        case version
        case graph
    }
    
    /// The graph in this score.
    public var graph: Graph

    /**
        Designated initializer
    
        - Parameters:
            - graph: The graph in this score.
     */
    public init(graph: Graph = Graph()) {
        self.graph = graph
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let version = try container.decode(Version.self, forKey: .version)

        if version.major != Version.current.major {
            throw Errors.invalidVersion
        }

        graph = try container.decode(Graph.self, forKey: .graph)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(Version.current, forKey: .version)
        try container.encode(graph, forKey: .graph)
    }
}

/// Directed edge that has a source node and target node.
public struct Edge: Codable {
    /// Unique identifier of this edge.
    public let id: String

    /// Source node identifier.
    public let source: String

    /// Target node identifer.
    public let target: String

    /// Source node output identifier.
    public let sourcePort: String?
    
    /// Target node input identifier.
    public let targetPort: String?
    
    /**
        Designated initializer
    
        - Parameters:
            - id: Unique identifier of this edge.
            - source: Source node identifier.
            - target: Target node identifier.
     */
    public init(id: String = IDGenerator.generateUniqueID(), source: String, target: String) {
        self.id = id
        self.source = source
        self.target = target
        self.sourcePort = nil
        self.targetPort = nil
    }
    
    /**
        Designated initializer
    
        - Parameters:
            - id: Unique identifier of this edge.
            - source: Source node identifier.
            - target: Target node identifier.
            - sourcePort: Source node output identifier.
            - targetPort: Target node input identifier.
     */
    public init(id: String = IDGenerator.generateUniqueID(), source: String, target: String, sourcePort: String, targetPort: String) {
        self.id = id
        self.source = source
        self.target = target
        self.sourcePort = sourcePort
        self.targetPort = targetPort
    }
}

/// Script that can run code on a graph.
public struct Script: Codable {
    /// Unique identifier of this script.
    public let name: String

    /// Code of this script.
    public let code: String

    /**
        Designated initializer
    
        - Parameters:
            - name: Unique identifier of this script.
            - code: Code of this script.
     */
    public init(name: String, code: String) {
        self.name = name
        self.code = code
    }
}

/// Time specified in nanoseconds.
public struct Time: Codable {
    /// Time in nanoseconds.
    public let nanos: Int64
    
    /// Time in seconds.
    public var seconds: Double {
        return Double(nanos) / 1000000000.0
    }
    
    /**
        Designated initializer
    
        - Parameters:
            - nanos: Time in nanoseconds.
     */
    public init(nanos: Int64) {
        self.nanos = nanos
    }
    
    /**
        Convenience initializer
    
        - Parameters:
            - seconds: Time in seconds.
     */
    public init(seconds: Double) {
        self.init(nanos: Int64(seconds * 1000000000.0))
    }

    // MARK: Codable

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        nanos = try container.decode(Int64.self)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        try container.encode(nanos)
    }
}
