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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.norberg.automatter.jackson.AutoMatterModule;
import java.io.IOException;

public class Converter {

  private static Converter DEFAULT;

  private ObjectMapper objectMapper;

  public Converter(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public static Converter getInstance() {
    if (DEFAULT == null) {
      DEFAULT = new Converter(new ObjectMapper().registerModule(new AutoMatterModule()));
    }
    return DEFAULT;
  }

  public ObjectMapper getObjectMapper() {
    return objectMapper;
  }

  public void setObjectMapper(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public Score fromJsonString(String json) throws IOException {
    return objectMapper.readValue(json, Score.class);
  }

  public String toJsonString(Score obj) throws JsonProcessingException {
    return objectMapper.writeValueAsString(obj);
  }

}
