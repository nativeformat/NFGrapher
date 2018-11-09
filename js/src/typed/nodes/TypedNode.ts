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
import { Command, Edge, Node, ContentType } from '../../score';
import { v4 as uuid } from 'uuid';
import { isUndefined } from '../../utils';

export default abstract class TypedNode {
  constructor(public readonly id: string, public readonly kind: string) {}

  public toNode(): Node {
    return {
      id: this.id,
      kind: this.kind,
      config: this.getConfig(),
      params: this.getParams()
    };
  }

  public toJSON(): Node {
    return this.toNode();
  }

  /**
   * @deprecated use `connectToTarget` or `connectToSource` instead.
   */
  public connect(target: TypedNode): Edge {
    console.warn(
      'The `connect` method is deprecated. Use `connectToSource` or `connectToTarget` instead.'
    );
    return {
      id: uuid(),
      source: this.id,
      target: target.id
    };
  }

  /**
   * Creates an edge from this node to the target node.
   * @param target Target node.
   */
  public connectToTarget(target: TypedNode): Edge;
  
  /**
   * Creates an edge from this node to the target node.
   * @param target Target node.
   * @param sourcePort Source output.
   * @param targetPort Target input.
   */
  public connectToTarget(target: TypedNode, sourcePort?: string, targetPort?: string): Edge {
    if (sourcePort && targetPort) {
      const outputContentType = this.getOutputs().get(sourcePort);
      if (isUndefined(outputContentType)) {
        throw new Error(`node="${this.id}" is missing output ${sourcePort}`);
      }

      const inputContentType = target.getInputs().get(targetPort);
      if (isUndefined(inputContentType)) {
        throw new Error(`node="${target.id}" is missing input ${targetPort}`);
      }

      if (outputContentType != inputContentType) {
        throw new Error(`incompatible content types ${outputContentType} - ${inputContentType}`);
      }

      return { id: uuid(), source: this.id, target: target.id, sourcePort, targetPort };
    }
    else {
      if (this.getOutputs().size == 0) {
        throw new Error(`node="${this.id}" cannot be a source`);
      }
      if (target.getInputs().size == 0) {
        throw new Error(`node="${target.id}" cannot be a target`);
      }
      return { id: uuid(), source: this.id, target: target.id };
    }
  }

  /**
   * Creates an edge from the target node to this node.
   * @param source Source node.
   */
  public connectToSource(source: TypedNode): Edge {
    return source.connectToTarget(this);
  }

  public getInputs(): Map<string, ContentType> {
    return new Map();
  }

  public getOutputs(): Map<string, ContentType> {
    return new Map();
  }

  protected getConfig(): { [key: string]: any } {
    return {};
  }

  protected getParams(): { [key: string]: Command[] } {
    return {};
  }
}
