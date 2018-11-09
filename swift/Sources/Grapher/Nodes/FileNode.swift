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

/// A plugin that plays different types of media files.
public final class FileNode: Node {

    private enum ConfigKeys: String, CodingKey {
        case file = "file"
        case when = "when"
        case duration = "duration"
        case offset = "offset"
    }

    public override class var inputs: [String: ContentType] {
        return [:]
    }

    public override class var outputs: [String: ContentType] {
        return ["audio": .audio]
    }

    /// Tells the plugin where to pull the file from, it supports both local files and HTTP based files.<br>Possible string formats:</br><br>- File: `<absolute-path-to-file>`</br><br>- Streamable Audio: `<HTTP(s)-URL>`</br><br>- Spotify Track: `spotify:track:<uri>`</br><br>- MIDI File: `midi:<absolute-path-to-midi-file>:soundfont:<absolute-path-to-soundfont-file>`
    public var file: String

    /// Tells the plugin when to start playing the file.
    public var when: Time

    /// Tells the plugin how long to play the file for.
    public var duration: Time

    /// Tells the plugin where within the track playback should begin.
    public var offset: Time

    /**
        Designated initializer

        - Parameters:
            - id: Unique identifier of this node.
            - file: Tells the plugin where to pull the file from, it supports both local files and HTTP based files.<br>Possible string formats:</br><br>- File: `<absolute-path-to-file>`</br><br>- Streamable Audio: `<HTTP(s)-URL>`</br><br>- Spotify Track: `spotify:track:<uri>`</br><br>- MIDI File: `midi:<absolute-path-to-midi-file>:soundfont:<absolute-path-to-soundfont-file>`
            - when: Tells the plugin when to start playing the file.
            - duration: Tells the plugin how long to play the file for.
            - offset: Tells the plugin where within the track playback should begin.
     */
    public init(id: String = IDGenerator.generateUniqueID(), file: String, when: Time = Time(nanos: 0), duration: Time = Time(nanos: 0), offset: Time = Time(nanos: 0)) {
        self.file = file
        self.when = when
        self.duration = duration
        self.offset = offset

        super.init(id: id, kind: .fileNode)
    }

    // MARK: Codable

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let config = try container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        file = try config.decode(String.self, forKey: .file)
        when = try config.decodeIfPresent(Time.self, forKey: .when) ?? Time(nanos: 0)
        duration = try config.decodeIfPresent(Time.self, forKey: .duration) ?? Time(nanos: 0)
        offset = try config.decodeIfPresent(Time.self, forKey: .offset) ?? Time(nanos: 0)

        try super.init(from: decoder)
    }

    public override func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        var config = container.nestedContainer(keyedBy: ConfigKeys.self, forKey: .config)
        try config.encode(file, forKey: .file)
        try config.encode(when, forKey: .when)
        try config.encode(duration, forKey: .duration)
        try config.encode(offset, forKey: .offset)

        try super.encode(to: encoder)
    }
}
