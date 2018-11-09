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

package com.spotify.nativeformat.schema;

import com.spotify.nativeformat.score.Command;
import com.spotify.nativeformat.score.Node;
import com.spotify.nativeformat.typed.params.TypedParam;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

/**
 * Describes a ParamDef and provides utility methods for reading from and writing to Score objects.
 *
 * @param <T> the type of the param.
 */
public class ParamMapper<T extends TypedParam<?>> {

  private final String name;

  private final Function<List<Command>, T> factory;

  public ParamMapper(String name, Function<List<Command>, T> factory) {
    this.name = name;
    this.factory = factory;
  }

  /**
   * Factory method to create a new instance of the typed param T.
   *
   * @return a new instance of T.
   */
  public T create() {
    return factory.apply(Collections.emptyList());
  }

  /**
   * Converts the given typed param to a Score Param.
   *
   * @param obj the typed param to convert
   */
  public void addToMap(final T obj, final Map<String, List<Command>> map) {
    map.put(this.name, obj.getCommands());
  }

  /**
   * Reads the typed param matching this description from the given Node's params.
   *
   * @param node the node to read from.
   * @return a Result
   */
  public T readParam(final Node node) {
    return factory.apply(node.params().getOrDefault(this.name, Collections.emptyList()));
  }
}
