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

/// Score Version.
public struct Version: Codable {
    public enum Errors: Error {
        case invalidVersionString
    }

    /// Current version.
    public static let current: Version = Version(1, 2, 12)

    /// Major version.
    public let major: Int

    /// Minor version.
    public let minor: Int

    /// Patch version.
    public let patch: Int

    /// Pre-release metadata.
    public let prereleaseIdentifiers: [String]

    /// Build metadata.
    public let buildMetadataIdentifiers: [String]

    /**
         Designated initializer

        - Parameters:
            - major: Major version.
            - minor: Minor version.
            - patch: Patch version.
            - prereleaseIdentifiers: Pre-release metadata.
            - buildMetadataIdentifiers: Build metadata.
    */
    public init(_ major: Int, _ minor: Int, _ patch: Int, prereleaseIdentifiers: [String] = [], buildMetadataIdentifiers: [String] = []) {
        self.major = major
        self.minor = minor
        self.patch = patch
        self.prereleaseIdentifiers = prereleaseIdentifiers
        self.buildMetadataIdentifiers = buildMetadataIdentifiers
    }

    // MARK: Codable

    public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let stringValue = try container.decode(String.self)

        let prereleaseStartIndex = stringValue.index(of: "-")
        let metadataStartIndex = stringValue.index(of: "+")

        let requiredEndIndex = prereleaseStartIndex ?? metadataStartIndex ?? stringValue.endIndex
        let requiredCharacters = stringValue.prefix(upTo: requiredEndIndex)
        let requiredComponents = requiredCharacters
            .split(separator: ".", maxSplits: 2, omittingEmptySubsequences: false)
            .map(String.init).flatMap({ Int($0) }).filter({ $0 >= 0 })

        guard requiredComponents.count == 3 else {
            throw Errors.invalidVersionString
        }

        self.major = requiredComponents[0]
        self.minor = requiredComponents[1]
        self.patch = requiredComponents[2]

        func identifiers(start: String.Index?, end: String.Index) -> [String] {
            guard let start = start else { return [] }
            let identifiers = stringValue[stringValue.index(after: start)..<end]
            return identifiers.split(separator: ".").map(String.init)
        }

        self.prereleaseIdentifiers = identifiers(
            start: prereleaseStartIndex,
            end: metadataStartIndex ?? stringValue.endIndex)
        self.buildMetadataIdentifiers = identifiers(
            start: metadataStartIndex,
            end: stringValue.endIndex)
    }

    public func encode(to encoder: Encoder) throws {
        var versionString = String(format: "%d.%d.%d", major, minor, patch)
        if !prereleaseIdentifiers.isEmpty {
            versionString += "-" + prereleaseIdentifiers.joined(separator: ".")
        }

        if !buildMetadataIdentifiers.isEmpty {
            versionString += "+" + buildMetadataIdentifiers.joined(separator: ".")
        }

        var container = encoder.singleValueContainer()
        try container.encode(versionString)
    }
}
