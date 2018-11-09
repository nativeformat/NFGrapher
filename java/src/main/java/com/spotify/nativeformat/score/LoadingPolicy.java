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

package com.spotify.nativeformat.score;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum LoadingPolicy {
  SOME_CONTENT_PLAYTHROUGH("someContentPlaythrough"),
  ALL_CONTENT_PLAYTHROUGH("allContentPlaythrough"),
  ;

  private static final Map<String, LoadingPolicy> lookup;

  static {
    lookup =
        Arrays.stream(LoadingPolicy.values()).collect(Collectors.toMap(k -> k.fieldName, k -> k));
  }

  private final String fieldName;

  LoadingPolicy(final String fieldName) {
    this.fieldName = fieldName;
  }

  @JsonValue
  public String getFieldName() {
    return this.fieldName;
  }

  @JsonCreator
  public static LoadingPolicy fromString(final String str) {
    final LoadingPolicy e = lookup.get(str);
    if (e == null) {
      throw new IllegalArgumentException("Cannot map string to LoadingPolicy");
    }
    return e;
  }
}
