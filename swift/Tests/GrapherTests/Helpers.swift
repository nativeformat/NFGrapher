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
@testable import Grapher

class Helpers {
    enum Errors: Error {
        case fixtureNotFound
        case fixtureJSONInvalid
        case scoreJSONInvalid
    }
    
    static func loadFixtureData(_ fixture: String) throws -> Data {
        if let data = try? Data(contentsOf: URL(fileURLWithPath: "../fixtures/" + fixture + ".json")) {
            return data
        }
        else if let path = Bundle(for: Helpers.self).url(forResource: fixture, withExtension: "json") {
            return try Data(contentsOf: path)
        }
        
        throw Errors.fixtureNotFound
    }
    
    static func loadFixtureDictionary(_ fixture: String) throws -> NSDictionary {
        let data = try loadFixtureData(fixture)
        
        guard let dictionary = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions(rawValue: 0)) as? NSDictionary else {
            throw Errors.fixtureJSONInvalid
        }
        
        return dictionary
    }
    
    static func loadFixtureScore(_ fixture: String) throws -> Score {
        let data = try loadFixtureData(fixture)
        let score = try JSONDecoder().decode(Score.self, from: data)

        return score
    }
    
    static func writeScoreData(_ score: Score) throws -> Data {
        let data = try JSONEncoder().encode(score)
        
        return data
    }
    
    static func writeScoreDictionary(_ score: Score) throws -> [String: Any] {
        let data = try writeScoreData(score)
        guard let dictionary = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions(rawValue: 0)) as? [String: Any] else {
            throw Errors.scoreJSONInvalid
        }

        return dictionary
    }
}
