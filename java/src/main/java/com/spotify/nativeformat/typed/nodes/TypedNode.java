/*-
 * -\-\-
 * nf-grapher-java
 * --
 * Copyright (C) 2016 - 2018 Spotify AB
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * -/-/-
 */

package com.spotify.nativeformat.typed.nodes;

import static java.util.Objects.requireNonNull;

import com.spotify.nativeformat.score.Edge;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.score.LoadingPolicy;
import com.spotify.nativeformat.score.ContentType;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

/**
 * Abstract class for strongly typed Nodes.
 */
abstract class TypedNode implements Node {

  private String id;
  private String kind;
  private LoadingPolicy loadingPolicy;

  TypedNode(final String kind) {
    this(null, kind, LoadingPolicy.ALL_CONTENT_PLAYTHROUGH);
  }
    
  TypedNode(final String kind, final LoadingPolicy loadingPolicy) {
    this(null, kind, loadingPolicy);
  }

  TypedNode(final String id, final String kind, final LoadingPolicy loadingPolicy) {
    this.id = id == null ? UUID.randomUUID().toString() : id;
    this.kind = requireNonNull(kind, "kind");
    this.loadingPolicy = requireNonNull(loadingPolicy, "loadingPolicy");
  }

  public String id() {
    return this.id;
  }

  public String kind() {
    return this.kind;
  }
    
  public LoadingPolicy loadingPolicy() {
    return this.loadingPolicy;
  }

  public Map<String, ContentType> inputs() {
    return new HashMap<String, ContentType>();
  }

  public Map<String, ContentType> outputs() {
    return new HashMap<String, ContentType>();
  }

  /**
   * Creates a new Edge with this node as the source and the given node the target.
   *
   * @param target the node to connect to
   * @return a new Edge
   */
   @Deprecated
  public Edge connect(final Node target) {
    return Edge.create(UUID.randomUUID().toString(), this.id(), target.id());
  }

  /**
   * Creates a new Edge with this node as the source and the given node the target.
   *
   * @param target the node to connect to
   * @throws IllegalArgumentException if this node cannot be a source node, or the given node
   * cannot be a target node.
   * @return a new Edge
   */
  public Edge connectToTarget(final TypedNode target) {
    requireNonNull(target, "target");
 
    if (this.outputs().isEmpty()) {
      throw new IllegalArgumentException("node=" + this.id + " cannot be a source");
    }
 
    if (target.inputs().isEmpty()) {
      throw new IllegalArgumentException("node=" + target.id + " cannot be a target");
    }
    return Edge.create(UUID.randomUUID().toString(), this.id(), target.id());
  }

  /**
   * Creates a new Edge with this node as the target and the given node as the source.
   * Fails if the given node cannot feed into this node.
   *
   * @param source the node to connect to
   * @throws IllegalArgumentException if this node cannot be a target node, or the given node
   * cannot be a source node.
   * @return a new Edge
   */
  public Edge connectToSource(final TypedNode source) {
    requireNonNull(source, "source");
    return source.connectToTarget(this);
  }

  /**
   * Creates a new Edge with this node as the source and the given node the target.
   *
   * @param target the node to connect to
   * @param sourcePort the source output to connect to
   * @param targetPort the target input to connect to
   * @throws IllegalArgumentException if this node cannot be a source node, or the given node
   * cannot be a target node.
   * @return a new Edge
   */
  public Edge connectToTarget(final TypedNode target, final String sourcePort, final String targetPort) {
    requireNonNull(target, "target");
    requireNonNull(sourcePort, "sourcePort");
    requireNonNull(targetPort, "targetPort");

    ContentType sourceOutputType = this.outputs().get(sourcePort);

    if (sourceOutputType == null) {
      throw new IllegalArgumentException("node=" + this.id + " does not have an output named " + sourcePort);
    }
    
    ContentType targetOutputType = target.inputs().get(targetPort);

    if (targetOutputType == null) {
      throw new IllegalArgumentException("node=" + target.id + " does not have an input named " + targetPort);
    }

    if (sourceOutputType != targetOutputType) {
      throw new IllegalArgumentException("incompatible types for edge with source=" + sourceOutputType.getFieldName() + 
                                         " target=" + targetOutputType.getFieldName());
    }

    return Edge.create(UUID.randomUUID().toString(), this.id(), target.id(), sourcePort, targetPort);
  }
}
