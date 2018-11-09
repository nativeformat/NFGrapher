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

/**
    Enumeration of different kinds of nodes.

    - eq3bandNode: A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and cutoff or center frequency of each section are controlled by audio parameters.
    - fileNode: A plugin that plays different types of media files.
    - noiseNode: A plugin that outputs noise.
    - silenceNode: A plugin that outputs silence.
    - loopNode: A plugin that loops an audio stream.
    - stretchNode: A plugin that can independently stretch time and shift the pitch of an audio stream.
    - delayNode: A plugin that controls delay time.
    - gainNode: A plugin that manipulates the volume of an audio stream.
    - sineNode: A plugin that generates sine wave signals.
    - filterNode: A filter that attenuates low and/or high frequencies
    - compressorNode: A plugin that performs dynamic range compression on an audio stream.
    - expanderNode: A plugin that performs dynamic range expansion on an audio stream.
    - companderNode: A plugin that performs dynamic range compansion (compression + expansion) on an audio stream.
*/
public enum NodeKind: String, Codable {
  /// A 3-band EQ consisting of a low shelf, a mid-range peaking filter, and high shelf. The gain and cutoff or center frequency of each section are controlled by audio parameters.
  case eq3bandNode = "com.nativeformat.plugin.eq.eq3band"

  /// A plugin that plays different types of media files.
  case fileNode = "com.nativeformat.plugin.file.file"

  /// A plugin that outputs noise.
  case noiseNode = "com.nativeformat.plugin.noise.noise"

  /// A plugin that outputs silence.
  case silenceNode = "com.nativeformat.plugin.noise.silence"

  /// A plugin that loops an audio stream.
  case loopNode = "com.nativeformat.plugin.time.loop"

  /// A plugin that can independently stretch time and shift the pitch of an audio stream.
  case stretchNode = "com.nativeformat.plugin.time.stretch"

  /// A plugin that controls delay time.
  case delayNode = "com.nativeformat.plugin.waa.delay"

  /// A plugin that manipulates the volume of an audio stream.
  case gainNode = "com.nativeformat.plugin.waa.gain"

  /// A plugin that generates sine wave signals.
  case sineNode = "com.nativeformat.plugin.wave.sine"

  /// A filter that attenuates low and/or high frequencies
  case filterNode = "com.nativeformat.plugin.eq.filter"

  /// A plugin that performs dynamic range compression on an audio stream.
  case compressorNode = "com.nativeformat.plugin.compressor.compressor"

  /// A plugin that performs dynamic range expansion on an audio stream.
  case expanderNode = "com.nativeformat.plugin.compressor.expander"

  /// A plugin that performs dynamic range compansion (compression + expansion) on an audio stream.
  case companderNode = "com.nativeformat.plugin.compressor.compander"
}
