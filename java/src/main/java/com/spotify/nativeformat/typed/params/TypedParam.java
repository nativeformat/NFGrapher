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

package com.spotify.nativeformat.typed.params;

import com.spotify.nativeformat.score.Command;
import java.util.List;

/**
 * Abstract class for strongly typed params.
 *
 * @param <T> the underlying type of the value the param represents.
 */
public abstract class TypedParam<T> {

  private T initialValue;

  TypedParam(T initialValue) {
    this.initialValue = initialValue;
  }

  public T getInitialValue() {
    return this.initialValue;
  }

  public abstract List<Command> getCommands();
}
