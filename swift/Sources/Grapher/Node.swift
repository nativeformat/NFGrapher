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

/// Class representing a node inside of a graph.
public class Node: Codable {
    internal enum CodingKeys: String, CodingKey {
        case id
        case kind
        case loadingPolicy
        case label
        case config
        case params
    }
    
    public class var inputs: [String: ContentType] {
        return [:]
    }
    
    public class var outputs: [String: ContentType] {
        return [:]
    }
    
    /// Unique identifier of this node.
    public var id: String
    
    /// Kind of this node.
    public var kind: NodeKind
    
    /// Loading policy of this node.
    public var loadingPolicy: LoadingPolicy
    
    /// Label that gives an optional description of this node.
    @available(*, deprecated)
    public var label: String?
    
    /**
        Designated initializer
    
        - Parameters:
            - id: Unique identifier of this node.
            - kind: Kind of this node.
            - loadingPolicy: Loading policy of this node.
     */
    public init(id: String = IDGenerator.generateUniqueID(), kind: NodeKind, loadingPolicy: LoadingPolicy = .allContentPlaythrough) {
        self.id = id
        self.kind = kind
        self.loadingPolicy = loadingPolicy
    }
    
    /**
        Create an edge from this node to a target node.
    
        - Parameters:
            - target: The target node to connect to.
     
        - Returns: A new edge between this node and the target node.
     */
    public func connect(to target: Node) -> Edge? {
        guard !type(of: self).outputs.isEmpty,
              !type(of: target).inputs.isEmpty else {
            return nil
        }
        
        return Edge(source: id, target: target.id)
    }
    
    /**
        Create an edge from this node to a target node.
    
        - Parameters:
            - target: The target node to connect to.
            - sourcePort: The source node's output to connect from.
            - targetPort: The target node's input to connect to.

        - Returns: A new edge between this node and the target node.
     */
    public func connect(to target: Node, sourcePort: String, targetPort: String) -> Edge? {
        guard let outputContentType = type(of: self).outputs[sourcePort],
              let inputContentType = type(of: target).inputs[targetPort],
              outputContentType == inputContentType else {
            return nil
        }
        
        return Edge(source: id, target: target.id, sourcePort: sourcePort, targetPort: targetPort)
    }
    
    // MARK: Codable
    
    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        kind = try container.decode(NodeKind.self, forKey: .kind)
        loadingPolicy = try container.decodeIfPresent(LoadingPolicy.self, forKey: .loadingPolicy) ?? .allContentPlaythrough
        label = try container.decodeIfPresent(String.self, forKey: .label)
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(kind, forKey: .kind)
        try container.encode(loadingPolicy, forKey: .loadingPolicy)
        try container.encodeIfPresent(label, forKey: .label)
    }
}
