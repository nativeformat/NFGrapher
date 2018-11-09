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

import XCTest
@testable import Grapher

class GrapherTests: XCTestCase {
    func testKitchenSink() {
        do {
            let score = try Helpers.loadFixtureScore("kitchen-sink")
            var allNodeKinds: [NodeKind] = [.eq3bandNode, .fileNode, .noiseNode, .silenceNode, .loopNode, .stretchNode, .delayNode, .gainNode, .sineNode, .filterNode, .compressorNode]
            
            for node in score.graph.nodes {
                guard let kindIndex = allNodeKinds.index(where: { $0 == node.kind }) else {
                    XCTFail("Node kind \(node.kind) missing")
                    return
                }

                allNodeKinds.remove(at: kindIndex)
            }
            
            XCTAssert(allNodeKinds.isEmpty, "\(allNodeKinds) missing from kitchen sink")
        }
        catch {
            XCTFail("Failed to decode fixture: \(error)")
        }
    }
    
    func testInvalidNode() {
        do {
            let _ = try Helpers.loadFixtureScore("invalid-node")
            
            XCTFail("Invalid node should not load")
        }
        catch Helpers.Errors.fixtureNotFound {
            XCTFail("Fixture not found")
        }
        catch {
            
        }
    }
    
    func testInvalidScore() {
        do {
            let _ = try Helpers.loadFixtureScore("invalid-score")
            
            XCTFail("Invalid score should not load")
        }
        catch Helpers.Errors.fixtureNotFound {
            XCTFail("Fixture not found")
        }
        catch {
            
        }
    }
    
    func testSerialization() {
        let node = FileNode(id: "1", file: "file.mp3", when: Time(nanos: 0), duration: Time(nanos: 1000), offset: Time(nanos: 0))
        let graph = Graph(id: "1", nodes: [node])
        let score = Score(graph: graph)
        let version = String(format: "%d.%d.%d", Version.current.major, Version.current.minor, Version.current.patch)
        do {
            let dictionary = try Helpers.writeScoreDictionary(score)
            let referenceDictionary: [String: Any] = ["version": version,
                                                      "graph": [
                                                         "id": "1",
                                                         "loadingPolicy": "allContentPlaythrough",
                                                         "nodes": [[
                                                             "id": "1",
                                                             "kind": "com.nativeformat.plugin.file.file",
                                                             "loadingPolicy": "allContentPlaythrough",
                                                             "config": [
                                                                 "duration": 1000,
                                                                 "file": "file.mp3",
                                                                 "offset": 0,
                                                                 "when": 0
                                                             ]
                                                         ]],
                                                         "edges": [],
                                                         "scripts": []
                                                    ]]
            
            XCTAssertEqual(NSDictionary(dictionary: dictionary), NSDictionary(dictionary: referenceDictionary), "Serialized dictionary is different than what we expect")
        }
        catch {
            XCTFail("Failed to write fixture: \(error)")
        }
    }
    
    func testTimeLimits() {
        do {
            let data = try Helpers.loadFixtureData("time-limits")
            let score = try JSONDecoder().decode(Score.self, from: data)
            
            guard let sineNode = score.graph.nodes.first as? SineNode else {
                XCTFail("Could not find valid node")
                return
            }
            
            XCTAssertEqual(sineNode.when.nanos, Int64.max)
        }
        catch {
            XCTFail("Failed to decode fixture: \(error)")
        }
    }
    
    func testValidEdgeConnection() {
        let fileNode = FileNode(file: "a file")
        let gainNode = GainNode(gain: AudioParam())
 
        XCTAssertNotNil(fileNode.connect(to: gainNode), "Connecting a producer to a transformer, consumer should create a valid edge")
    }
 
    func testInvalidEdgeConnection() {
        let fileNode = FileNode(file: "a file")
        let gainNode = GainNode(gain: AudioParam())
 
        XCTAssertNil(gainNode.connect(to: fileNode), "Connecting a transformer, consumer to a producer should not create a valid edge")
    }
    
    func testValidNamedEdgeConnection() {
        let fileNode = FileNode(file: "a file")
        let gainNode = GainNode(gain: AudioParam())
 
        XCTAssertNotNil(fileNode.connect(to: gainNode, sourcePort: "audio", targetPort: "audio"), "Connecting nodes with valid output and input names, should create a valid edge")
    }
    
    func testInvalidNamedEdgeConnection() {
        let fileNode = FileNode(file: "a file")
        let gainNode = GainNode(gain: AudioParam())
 
        XCTAssertNil(fileNode.connect(to: gainNode, sourcePort: "invalid", targetPort: "invalid"), "Connecting nodes with invalid output and input names, should not create a valid edge")
    }
 
    static var allTests = [
        ("testKitchenSink", testKitchenSink),
        ("testInvalidNode", testInvalidNode),
        ("testInvalidScore", testInvalidScore),
        ("testSerialization", testSerialization),
        ("testTimeLimits", testTimeLimits),
        ("testValidEdgeConnection", testValidEdgeConnection),
        ("testInvalidEdgeConnection", testInvalidEdgeConnection),
        ("testValidNamedEdgeConnection", testValidNamedEdgeConnection),
        ("testInvalidNamedEdgeConnection", testInvalidNamedEdgeConnection),
    ]
}
