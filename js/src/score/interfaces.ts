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

export interface Score {
  graph: Graph;
  version: string;
}

export interface Graph {
  id: string;
  loadingPolicy?: LoadingPolicy;
  nodes?: Node[];
  edges?: Edge[];
  scripts?: Script[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourcePort?: string;
  targetPort?: string;
}

export enum LoadingPolicy {
  AllContentPlaythrough = 'allContentPlaythrough',
  SomeContentPlaythrough = 'someContentPlaythrough'
}

export interface Node {
  id: string;
  kind: string;
  loadingPolicy?: LoadingPolicy;
  params?: { [key: string]: Command[] };
  config?: { [key: string]: any };
}

export interface Command {
  name: string;
  args?: { [key: string]: any };
}

export interface Script {
  name: string;
  code: string;
}
