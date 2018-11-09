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
import 'jest';
import { cloneDeepWith } from 'lodash';
import { Score, FileNode, GainNode } from '../';

// tslint:disable:no-var-requires
const invalidScore = require('../../../fixtures/invalid-score.json');
const invalidNode = require('../../../fixtures/invalid-node.json');
const kitchenSink = require('../../../fixtures/kitchen-sink.json');

const withoutIds: (obj: any) => any = obj =>
  cloneDeepWith(obj, value => {
    delete value.id;
  });

describe('Score', () => {
  // In JS, the invalid Graph type of Array can still be read as an object and inspected
  // for graph properties. Therefore, passing an array for the score's graph property
  // will result in the default Graph object and won't throw.
  it('handles invalid score', () => {
    expect(withoutIds(Score.from(invalidScore))).toEqual(
      withoutIds(new Score())
    );
  });
  it('throws with invalid node', () => {
    expect(() => Score.from(invalidNode)).toThrow();
  });
  // We check the parsed object after serialization since stringify isn't deterministic.
  it('serializes', () => {
    const deserialized = Score.from(kitchenSink);
    const serialized = JSON.parse(JSON.stringify(deserialized));
    expect(serialized).toEqual(kitchenSink);
  });
});

describe('Node', () => {
  let source: FileNode;
  let gain: GainNode;
  beforeEach(() => {
    source = FileNode.create({
      file: 'spotify:track:4RDKrwyA9YouzL1LxvMaxH'
    });
    gain = GainNode.create();
  });
  it('produces a valid edge when connecting a producer to a transformer', () => {
    const edge = source.connectToTarget(gain);
    expect(edge.source).toBe(source.id);
    expect(edge.target).toBe(gain.id);
  });
  it('throws when connecting a transformer to a producer', () => {
    expect(() => gain.connectToTarget(source)).toThrow();
  });
});
