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
/**
 * Computes the number of nanoseconds in the milliseconds given.
 */
export function millisToNanos(millis: number = 1): number {
  return millis * 1e6;
}

/**
 * Computes the number of nanoseconds in the seconds given.
 */
export function secondsToNanos(seconds: number = 1): number {
  return seconds * 1e9;
}

/**
 * Computes the number of nanoseconds in the minutes given.
 */
export function minutesToNanos(minutes: number = 1): number {
  return minutes * 6e10;
}
