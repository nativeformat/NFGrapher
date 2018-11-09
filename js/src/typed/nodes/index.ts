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
// under the License.

/* Generated */

import { default as Eq3bandNode } from './Eq3bandNode';
import { default as FileNode } from './FileNode';
import { default as NoiseNode } from './NoiseNode';
import { default as SilenceNode } from './SilenceNode';
import { default as LoopNode } from './LoopNode';
import { default as StretchNode } from './StretchNode';
import { default as DelayNode } from './DelayNode';
import { default as GainNode } from './GainNode';
import { default as SineNode } from './SineNode';
import { default as FilterNode } from './FilterNode';
import { default as CompressorNode } from './CompressorNode';
import { default as ExpanderNode } from './ExpanderNode';
import { default as CompanderNode } from './CompanderNode';
export { default as TypedNode } from './TypedNode';
/**
 * Map of Node kinds to typed classes.
 */
export const NodeKinds = {
  'com.nativeformat.plugin.eq.eq3band': Eq3bandNode,
  'com.nativeformat.plugin.file.file': FileNode,
  'com.nativeformat.plugin.noise.noise': NoiseNode,
  'com.nativeformat.plugin.noise.silence': SilenceNode,
  'com.nativeformat.plugin.time.loop': LoopNode,
  'com.nativeformat.plugin.time.stretch': StretchNode,
  'com.nativeformat.plugin.waa.delay': DelayNode,
  'com.nativeformat.plugin.waa.gain': GainNode,
  'com.nativeformat.plugin.wave.sine': SineNode,
  'com.nativeformat.plugin.eq.filter': FilterNode,
  'com.nativeformat.plugin.compressor.compressor': CompressorNode,
  'com.nativeformat.plugin.compressor.expander': ExpanderNode,
  'com.nativeformat.plugin.compressor.compander': CompanderNode
};
/**
 * Export Node config interfaces.
 */
export * from './Eq3bandNode';
export * from './FileNode';
export * from './NoiseNode';
export * from './SilenceNode';
export * from './LoopNode';
export * from './StretchNode';
export * from './DelayNode';
export * from './GainNode';
export * from './SineNode';
export * from './FilterNode';
export * from './CompressorNode';
export * from './ExpanderNode';
export * from './CompanderNode';
/**
 * Export Node types.
 */
export {
  Eq3bandNode,
  FileNode,
  NoiseNode,
  SilenceNode,
  LoopNode,
  StretchNode,
  DelayNode,
  GainNode,
  SineNode,
  FilterNode,
  CompressorNode,
  ExpanderNode,
  CompanderNode
};
